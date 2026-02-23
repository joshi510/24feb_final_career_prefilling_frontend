const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001';

class AuthService {
  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  setAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async login(email, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: email,
        password: password
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    this.setAuth(data.access_token, data.user);
    return data;
  }

  async register(email, password, firstName, lastName, contactNumber, parentContactNumber, schoolInstituteName, currentEducation, stream, familyAnnualIncome) {
    // Clean phone numbers to only digits
    const contactDigits = contactNumber.replace(/\D/g, '');
    const parentContactDigits = parentContactNumber.replace(/\D/g, '');
    
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        contact_number: contactDigits,
        parent_contact_number: parentContactDigits,
        school_institute_name: schoolInstituteName,
        current_education: currentEducation,
        stream: stream,
        family_annual_income: familyAnnualIncome
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(error.detail || 'Registration failed');
    }

    const data = await response.json();
    this.setAuth(data.access_token, data.user);
    return data;
  }

  logout() {
    this.clearAuth();
  }
}

export default new AuthService();

