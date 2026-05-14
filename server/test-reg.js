import http from 'http';

const data = JSON.stringify({
  name: 'Test Student',
  email: 'test@student.com',
  password: 'password',
  role: 'STUDENT'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(res.statusCode, body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
