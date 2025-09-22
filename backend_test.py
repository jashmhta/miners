#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class BruteosaurAPITester:
    def __init__(self, base_url="https://crypto-miner-auth.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        self.tests_run = 0
        self.tests_passed = 0
        self.user_id = None
        self.username = None

    def run_test(self, name, method, endpoint, expected_status, data=None, check_cookie=False):
        """Run a single API test"""
        url = f"{self.base_url}/api{endpoint}"
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url)
            elif method == 'POST':
                response = self.session.post(url, json=data)
            elif method == 'PATCH':
                response = self.session.patch(url, json=data)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                # Check for Set-Cookie header if requested
                if check_cookie and 'Set-Cookie' in response.headers:
                    print(f"   Cookie set: {response.headers['Set-Cookie']}")
                elif check_cookie:
                    print("   ⚠️  Warning: No Set-Cookie header found")
                
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2, default=str)}")
                    return True, response_data
                except:
                    print(f"   Response: {response.text}")
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health(self):
        """Test health endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "/",
            200
        )
        if success and response.get('message') == "Bruteosaur API online":
            print("   ✅ Health message correct")
            return True
        elif success:
            print(f"   ⚠️  Unexpected message: {response.get('message')}")
        return success

    def test_register(self):
        """Test user registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_username = f"testuser{timestamp}"
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "/auth/register",
            201,
            data={"username": test_username, "password": "Password123"}
        )
        
        if success:
            role = response.get('role')
            if role == 'user':
                print("   ✅ New user correctly assigned user role (admin already exists)")
            else:
                print(f"   ⚠️  Expected user role, got: {role}")
            return True
        return False

    def test_login(self):
        """Test user login with existing admin user"""
        # Use existing admin user from database
        self.username = "adminuser000704"
        
        success, response = self.run_test(
            "Admin User Login",
            "POST",
            "/auth/login",
            200,
            data={"username": self.username, "password": "Password123"},
            check_cookie=True
        )
        
        if success:
            self.user_id = response.get('id')
            role = response.get('role')
            if role == 'admin':
                print("   ✅ Admin user logged in successfully")
            else:
                print(f"   ⚠️  Expected admin role, got: {role}")
        
        return success

    def test_me(self):
        """Test get current user"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "/auth/me",
            200
        )
        
        if success and response.get('username') == self.username:
            print("   ✅ User data matches")
        elif success:
            print(f"   ⚠️  Username mismatch: expected {self.username}, got {response.get('username')}")
        
        return success

    def test_create_log(self):
        """Test log creation"""
        success, response = self.run_test(
            "Create Log",
            "POST",
            "/logs",
            201,
            data={
                "type": "ui",
                "action": "visit",
                "metadata": {"page": "/"}
            }
        )
        
        if success and 'id' in response:
            print(f"   ✅ Log created with ID: {response['id']}")
        
        return success

    def test_admin_users(self):
        """Test admin users endpoint"""
        success, response = self.run_test(
            "Admin - Get Users",
            "GET",
            "/admin/users",
            200
        )
        
        if success:
            items = response.get('items', [])
            total = response.get('total', 0)
            print(f"   ✅ Found {len(items)} users, total: {total}")
            
            # Check if our user is in the list
            user_found = any(u.get('username') == self.username for u in items)
            if user_found:
                print(f"   ✅ User {self.username} found in list")
            else:
                print(f"   ⚠️  User {self.username} not found in list")
        
        return success

    def test_admin_logs(self):
        """Test admin logs endpoint"""
        success, response = self.run_test(
            "Admin - Get Logs",
            "GET",
            "/admin/logs",
            200
        )
        
        if success:
            items = response.get('items', [])
            print(f"   ✅ Found {len(items)} log entries")
            if items:
                print(f"   Latest log: {items[0].get('type')}/{items[0].get('action')}")
        
        return success

    def test_admin_stats(self):
        """Test admin stats endpoint"""
        success, response = self.run_test(
            "Admin - Get Stats",
            "GET",
            "/admin/stats",
            200
        )
        
        if success:
            totals = response.get('totals', {})
            print(f"   ✅ Stats - Users: {totals.get('users', 0)}, Logs: {totals.get('logs', 0)}, Validations: {totals.get('wallet_validations', 0)}")
        
        return success

    def test_wallet_config(self):
        """Test wallet config endpoint"""
        success, response = self.run_test(
            "Wallet - WalletConnect Config",
            "GET",
            "/wallet/wc/config",
            501  # Expected since WC_PROJECT_ID is not set
        )
        
        if success and response.get('detail') == 'WALLETCONNECT_PROJECT_ID_MISSING':
            print("   ✅ Correct error for missing WC_PROJECT_ID")
        
        return success

    def test_wallet_manual_validate_mnemonic(self):
        """Test manual wallet validation with mnemonic"""
        dummy_mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
        
        success, response = self.run_test(
            "Wallet - Manual Validate (Mnemonic)",
            "POST",
            "/wallet/manual-validate",
            501,  # Expected since RPC is not configured
            data={
                "method": "mnemonic",
                "secret": dummy_mnemonic
            }
        )
        
        if success and response.get('detail') == 'RPC_NOT_CONFIGURED':
            print("   ✅ Correct error for missing RPC configuration")
        
        return success

    def test_wallet_manual_validate_private_key(self):
        """Test manual wallet validation with private key"""
        dummy_private_key = "0x" + "a" * 64  # 64 hex characters
        
        success, response = self.run_test(
            "Wallet - Manual Validate (Private Key)",
            "POST",
            "/wallet/manual-validate",
            501,  # Expected since RPC is not configured
            data={
                "method": "private_key",
                "secret": dummy_private_key
            }
        )
        
        if success and response.get('detail') == 'RPC_NOT_CONFIGURED':
            print("   ✅ Correct error for missing RPC configuration")
        
        return success

def main():
    print("🚀 Starting Bruteosaur API Tests")
    print("=" * 50)
    
    tester = BruteosaurAPITester()
    
    # Test sequence as specified in the requirements
    tests = [
        ("Health Check", tester.test_health),
        ("User Registration", tester.test_register),
        ("User Login", tester.test_login),
        ("Get Current User", tester.test_me),
        ("Create Log", tester.test_create_log),
        ("Admin Users", tester.test_admin_users),
        ("Admin Logs", tester.test_admin_logs),
        ("Admin Stats", tester.test_admin_stats),
        ("Wallet Config", tester.test_wallet_config),
        ("Wallet Manual Validate (Mnemonic)", tester.test_wallet_manual_validate_mnemonic),
        ("Wallet Manual Validate (Private Key)", tester.test_wallet_manual_validate_private_key),
    ]
    
    for test_name, test_func in tests:
        try:
            test_func()
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
        return 1

if __name__ == "__main__":
    sys.exit(main())