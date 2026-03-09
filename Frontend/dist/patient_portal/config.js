// Patient Portal Configuration
const API_CONFIG = {
    BASE_URL: 'https://api-hms-mock.com/api', // Update this to your production API URL
    ENDPOINTS: {
        CHECK_STATUS: '/patients/check-status',
        LOGIN: '/patients/login',
        REGISTER: '/patients/register'
    }
};

// Protect the config from modification
Object.freeze(API_CONFIG);
