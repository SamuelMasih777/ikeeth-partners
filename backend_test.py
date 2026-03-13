#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class IKTHEESAdminTester:
    def __init__(self, base_url="https://bold-ideas.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api"
        self.admin_api = f"{base_url}/api/admin"
        self.token = None
        self.admin_email = "admin@ikthees.com"
        self.admin_password = "Admin123!"
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def log_test(self, name: str, success: bool, details: Dict[str, Any] = None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ PASS: {name}")
        else:
            print(f"❌ FAIL: {name}")
            if details:
                print(f"   Details: {details}")
        
        self.results.append({
            "test": name,
            "success": success,
            "details": details or {}
        })

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int = 200, 
                 data: Dict = None, headers: Dict = None, use_auth: bool = True) -> tuple:
        """Run a single API test"""
        url = f"{self.api_base}/{endpoint}" if not endpoint.startswith('/api') else f"{self.base_url}{endpoint}"
        
        # Default headers
        req_headers = {'Content-Type': 'application/json'}
        if headers is not None:
            req_headers.update(headers)
        elif self.token and use_auth:
            req_headers['Authorization'] = f'Bearer {self.token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=req_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=req_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=req_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=req_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            response_data = {}
            
            try:
                if response.content:
                    response_data = response.json()
            except:
                response_data = {"raw_content": response.text[:200]}

            details = {
                "status_code": response.status_code,
                "expected": expected_status,
                "response": response_data
            }
            
            self.log_test(name, success, details)
            return success, response_data

        except Exception as e:
            details = {"error": str(e), "url": url}
            self.log_test(name, False, details)
            return False, {}

    def test_health_check(self):
        """Test basic health check"""
        self.run_test("Health Check", "GET", "health", 200)

    def test_admin_login(self):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST", 
            "/api/admin/login",
            200,
            data={"email": self.admin_email, "password": self.admin_password}
        )
        
        if success and 'token' in response:
            self.token = response['token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_admin_me(self):
        """Test admin me endpoint"""
        if not self.token:
            self.log_test("Admin Me", False, {"error": "No token available"})
            return False
            
        success, response = self.run_test(
            "Admin Me",
            "GET",
            "/api/admin/me",
            200
        )
        return success

    def test_dashboard_stats(self):
        """Test admin dashboard stats"""
        success, response = self.run_test(
            "Dashboard Stats",
            "GET",
            "/api/admin/dashboard",
            200
        )
        
        if success:
            expected_keys = ['portfolio_count', 'team_count', 'insights_count', 'contact_count', 'pitch_count', 'newsletter_count']
            missing_keys = [key for key in expected_keys if key not in response]
            if missing_keys:
                self.log_test("Dashboard Stats Content", False, {"missing_keys": missing_keys})
            else:
                self.log_test("Dashboard Stats Content", True, {"stats": response})
        
        return success

    def test_portfolio_crud(self):
        """Test portfolio CRUD operations"""
        # Test GET portfolio
        success, portfolio = self.run_test("Get Portfolio", "GET", "/api/admin/portfolio", 200)
        
        if not success:
            return False

        # Test CREATE portfolio
        test_company = {
            "name": "Test Company",
            "sector": "Artificial Intelligence", 
            "description": "Test AI company for testing purposes",
            "stage": "Seed",
            "year": 2024,
            "website": "https://testcompany.com",
            "is_featured": True,
            "order": 999
        }
        
        success, created = self.run_test("Create Portfolio", "POST", "/api/admin/portfolio", 200, test_company)
        if not success:
            return False
            
        company_id = created.get('id')
        if not company_id:
            self.log_test("Create Portfolio - ID Check", False, {"error": "No ID returned"})
            return False

        # Test UPDATE portfolio
        update_data = {"name": "Updated Test Company", "description": "Updated description"}
        success, updated = self.run_test(
            "Update Portfolio", 
            "PUT", 
            f"/api/admin/portfolio/{company_id}", 
            200, 
            update_data
        )
        
        # Test DELETE portfolio
        success, _ = self.run_test("Delete Portfolio", "DELETE", f"/api/admin/portfolio/{company_id}", 200)
        return success

    def test_team_crud(self):
        """Test team CRUD operations"""
        # Test GET team
        success, team = self.run_test("Get Team", "GET", "/api/admin/team", 200)
        if not success:
            return False

        # Test CREATE team member
        test_member = {
            "name": "Test Member",
            "title": "Test Engineer", 
            "bio": "Test bio for testing purposes",
            "linkedin": "https://linkedin.com/in/testmember",
            "is_advisor": False,
            "order": 999
        }
        
        success, created = self.run_test("Create Team Member", "POST", "/api/admin/team", 200, test_member)
        if not success:
            return False
            
        member_id = created.get('id')
        if not member_id:
            self.log_test("Create Team - ID Check", False, {"error": "No ID returned"})
            return False

        # Test UPDATE team member
        update_data = {"name": "Updated Test Member", "title": "Senior Test Engineer"}
        success, updated = self.run_test(
            "Update Team Member", 
            "PUT", 
            f"/api/admin/team/{member_id}", 
            200, 
            update_data
        )
        
        # Test DELETE team member
        success, _ = self.run_test("Delete Team Member", "DELETE", f"/api/admin/team/{member_id}", 200)
        return success

    def test_insights_crud(self):
        """Test insights CRUD operations"""
        # Test GET insights
        success, insights = self.run_test("Get Insights", "GET", "/api/admin/insights", 200)
        if not success:
            return False

        # Test CREATE insight
        test_insight = {
            "title": "Test Insight Article",
            "excerpt": "Test excerpt for testing purposes", 
            "content": "Test content for the insight article. This is a comprehensive test.",
            "category": "Testing",
            "read_time": "3 min",
            "is_published": True,
            "is_featured": False
        }
        
        success, created = self.run_test("Create Insight", "POST", "/api/admin/insights", 200, test_insight)
        if not success:
            return False
            
        insight_id = created.get('id')
        if not insight_id:
            self.log_test("Create Insight - ID Check", False, {"error": "No ID returned"})
            return False

        # Test GET single insight
        success, insight = self.run_test("Get Single Insight", "GET", f"/api/admin/insights/{insight_id}", 200)
        
        # Test UPDATE insight (publish/unpublish)
        update_data = {"title": "Updated Test Insight", "is_published": False}
        success, updated = self.run_test(
            "Update Insight", 
            "PUT", 
            f"/api/admin/insights/{insight_id}", 
            200, 
            update_data
        )
        
        # Test DELETE insight
        success, _ = self.run_test("Delete Insight", "DELETE", f"/api/admin/insights/{insight_id}", 200)
        return success

    def test_contact_submissions(self):
        """Test contact submissions management"""
        # First create a test contact submission via public API
        test_contact = {
            "name": "Test Contact",
            "email": "test@example.com",
            "company": "Test Company",
            "inquiry_type": "Partnership",
            "message": "Test message for contact submission"
        }
        
        # Create via public API
        success, created = self.run_test(
            "Create Contact Submission (Public)", 
            "POST", 
            "contact", 
            200, 
            test_contact,
            use_auth=False
        )
        
        if not success:
            return False
            
        # Test GET contacts via admin
        success, contacts = self.run_test("Get Contact Submissions", "GET", "/api/admin/contacts", 200)
        
        if success and contacts:
            # Test GET single contact (which marks it as read)
            contact_id = contacts[0]['id']
            success, contact = self.run_test("Get Single Contact", "GET", f"/api/admin/contacts/{contact_id}", 200)
        
        return success

    def test_pitch_submissions(self):
        """Test pitch submissions management"""
        # First create a test pitch submission via public API
        test_pitch = {
            "founder_name": "Test Founder",
            "email": "founder@testcompany.com",
            "company_name": "Test Startup",
            "website": "https://teststartup.com",
            "industry": "AI/ML",
            "funding_stage": "Seed",
            "description": "Test pitch description for testing purposes"
        }
        
        # Create via public API
        success, created = self.run_test(
            "Create Pitch Submission (Public)", 
            "POST", 
            "pitch", 
            200, 
            test_pitch,
            use_auth=False
        )
        
        if not success:
            return False
            
        pitch_id = created.get('id')
        
        # Test GET pitches via admin
        success, pitches = self.run_test("Get Pitch Submissions", "GET", "/api/admin/pitches", 200)
        
        if success and pitch_id:
            # Test status update
            status_update = {"status": "reviewed", "notes": "Reviewed during testing"}
            success, updated = self.run_test(
                "Update Pitch Status", 
                "PUT", 
                f"/api/admin/pitches/{pitch_id}/status", 
                200, 
                status_update
            )
        
        return success

    def test_newsletter_subscriptions(self):
        """Test newsletter subscription management"""
        # First create a test subscription via public API
        test_subscription = {
            "email": f"test-{datetime.now().strftime('%H%M%S')}@example.com"
        }
        
        # Create via public API
        success, created = self.run_test(
            "Create Newsletter Subscription (Public)", 
            "POST", 
            "newsletter", 
            200, 
            test_subscription,
            use_auth=False
        )
        
        if not success:
            return False
            
        # Test GET newsletter subscriptions via admin
        success, subscriptions = self.run_test("Get Newsletter Subscriptions", "GET", "/api/admin/newsletter", 200)
        
        return success

    def test_site_settings(self):
        """Test site settings management"""
        # Test GET settings
        success, settings = self.run_test("Get Site Settings", "GET", "/api/admin/settings", 200)
        
        if not success:
            return False
            
        # Test UPDATE settings
        update_data = {
            "portfolio_companies": 50,
            "capital_deployed": "$1B",
            "industries": 10
        }
        
        success, updated = self.run_test("Update Site Settings", "PUT", "/api/admin/settings", 200, update_data)
        return success

    def test_public_apis(self):
        """Test public APIs (no auth required)"""
        public_tests = [
            ("Public Portfolio", "GET", "portfolio", 200),
            ("Public Team", "GET", "team", 200),
            ("Public Advisors", "GET", "advisors", 200),
            ("Public Insights", "GET", "insights", 200),
            ("Public Stats", "GET", "stats", 200),
        ]
        
        all_success = True
        for name, method, endpoint, expected in public_tests:
            success, _ = self.run_test(name, method, endpoint, expected, use_auth=False)
            if not success:
                all_success = False
                
        return all_success

    def run_all_tests(self):
        """Run all test suites"""
        print(f"🧪 Starting IKTHEES PARTNERS Admin Backend Tests")
        print(f"🔗 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Basic connectivity
        self.test_health_check()
        
        # Authentication tests
        if not self.test_admin_login():
            print("❌ CRITICAL: Admin login failed - stopping other admin tests")
            self.run_test("Admin Me", False, {"error": "Login required"})
            self.print_summary()
            return 1
            
        self.test_admin_me()
        
        # Admin functionality tests
        self.test_dashboard_stats()
        self.test_portfolio_crud()
        self.test_team_crud() 
        self.test_insights_crud()
        self.test_contact_submissions()
        self.test_pitch_submissions()
        self.test_newsletter_subscriptions()
        self.test_site_settings()
        
        # Public API tests
        self.test_public_apis()
        
        self.print_summary()
        return 0 if self.tests_passed == self.tests_run else 1

    def print_summary(self):
        """Print test summary"""
        print("=" * 60)
        print(f"📊 TEST SUMMARY")
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.tests_passed != self.tests_run:
            print("\n❌ FAILED TESTS:")
            for result in self.results:
                if not result['success']:
                    print(f"  - {result['test']}")
                    if result['details'].get('error'):
                        print(f"    Error: {result['details']['error']}")
                    if result['details'].get('status_code'):
                        print(f"    Status: {result['details']['status_code']} (expected {result['details'].get('expected', 'N/A')})")

if __name__ == "__main__":
    tester = IKTHEESAdminTester()
    sys.exit(tester.run_all_tests())