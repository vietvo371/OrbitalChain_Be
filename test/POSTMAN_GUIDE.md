# Postman Collection Guide - Space Debris API

## 🚀 Quick Setup

### 1. Import Collection
1. Mở Postman
2. Click **Import** button
3. Chọn file `Space_Debris_API.postman_collection.json`
4. Click **Import**

### 2. Setup Environment Variables
1. Click **Environments** tab
2. Click **Create Environment**
3. Tên: `Space Debris API`
4. Thêm các variables:
   - `base_url`: `http://localhost:3030/api/v1`
   - `admin_token`: (để trống, sẽ được set tự động)
   - `moderator_token`: (để trống, sẽ được set tự động)
   - `user_token`: (để trống, sẽ được set tự động)

### 3. Select Environment
1. Click dropdown environment ở góc trên bên phải
2. Chọn **Space Debris API**

---

## 🔐 Authentication Flow

### Step 1: Login để lấy tokens
1. **Authentication > Login Admin**
   - Chạy request này trước
   - Token sẽ được tự động lưu vào `admin_token`

2. **Authentication > Login Moderator**
   - Chạy request này
   - Token sẽ được tự động lưu vào `moderator_token`

3. **Authentication > Login User**
   - Chạy request này
   - Token sẽ được tự động lưu vào `user_token`

### Step 2: Test các API khác
- Tất cả API đã được cấu hình sẵn để sử dụng tokens
- Chỉ cần chạy request, không cần thêm header Authorization

---

## 📋 Test Scenarios

### Scenario 1: Health Check
```
1. Health Check > Get Health Status
   - Expected: 200 OK
   - Response: {"status": "OK", "timestamp": "...", "uptime": 123}
```

### Scenario 2: User Management
```
1. Authentication > Login Admin
2. Users > Get All Users (Admin)
3. Users > Create User (Admin)
4. Users > Get User by ID
5. Users > Update User
6. Users > Update User Points
```

### Scenario 3: Debris Management
```
1. Authentication > Login User
2. Debris > Get All Debris
3. Debris > Get Debris by Catalog ID
4. Debris > Get Debris by Risk Score
5. Debris > Get Debris by Location
6. Debris > Create Debris (Admin) - cần admin token
```

### Scenario 4: Observation Workflow
```
1. Authentication > Login User
2. Observations > Create Observation
3. Authentication > Login Moderator
4. Observations > Get Pending Observations (Moderator)
5. Observations > Approve Observation (Moderator)
6. Observations > Get Approved Observations
```

### Scenario 5: Moderation Workflow
```
1. Authentication > Login Moderator
2. Moderations > Create Moderation (Moderator)
3. Moderations > Get Moderations by Moderator
4. Moderations > Get Moderation Stats
5. Moderations > Update Moderation (Moderator)
```

### Scenario 6: Blockchain Logs
```
1. Authentication > Login User
2. Blockchain Logs > Get All Blockchain Logs
3. Blockchain Logs > Get Blockchain Stats
4. Blockchain Logs > Get Latest Block
5. Authentication > Login Admin
6. Blockchain Logs > Create Blockchain Log (Admin)
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. 401 Unauthorized
- **Cause**: Token hết hạn hoặc không có token
- **Solution**: Chạy lại login request để lấy token mới

#### 2. 403 Forbidden
- **Cause**: Không có quyền truy cập (role không đúng)
- **Solution**: Sử dụng đúng token cho role cần thiết

#### 3. 404 Not Found
- **Cause**: URL không đúng hoặc resource không tồn tại
- **Solution**: Kiểm tra lại URL và ID parameters

#### 4. 400 Bad Request
- **Cause**: Dữ liệu request không hợp lệ
- **Solution**: Kiểm tra lại body request và validation rules

### Debug Tips

#### 1. Check Environment Variables
- Click **Environments** tab
- Verify `base_url` = `http://localhost:3030/api/v1`
- Check tokens are set after login

#### 2. Check Request Headers
- Click **Headers** tab trong request
- Verify `Authorization: Bearer <token>` is present

#### 3. Check Response
- Click **Response** tab
- Look for error messages in response body
- Check status code

---

## 📊 Sample Data

### Test Credentials
```
Admin:
- Email: admin@orbitalchain.com
- Password: admin123

Moderator:
- Email: moderator@orbitalchain.com
- Password: moderator123

User:
- Email: user1@orbitalchain.com
- Password: user123
```

### Sample Debris Data
```json
{
  "catalog_id": "25544",
  "source": "NORAD",
  "epoch": "2024-01-15T12:00:00.000Z",
  "tle_line1": "1 25544U 98067A   24015.50000000  .00000000  00000-0  00000+0 0  9990",
  "tle_line2": "2 25544  51.6400 123.4567 0001234   0.0000   0.0000 15.12345678901234",
  "lat": 51.64,
  "lon": 123.4567,
  "alt": 400.5,
  "risk_score": 8.5,
  "on_chain_tx": "0xabc123..."
}
```

### Sample Observation Data
```json
{
  "debris_id": "{debris_id}",
  "image_url": "https://example.com/image.jpg",
  "note": "Clear observation of debris object",
  "location_lat": 51.64,
  "location_lon": 123.4567,
  "location_alt": 400.5,
  "tx_hash": "0xobs123..."
}
```

---

## 🎯 API Testing Checklist

### ✅ Authentication
- [ ] Register new user
- [ ] Login with all roles (admin, moderator, user)
- [ ] Get user profile
- [ ] Change password
- [ ] Reset password (admin only)
- [ ] Logout

### ✅ Users
- [ ] Get all users (admin only)
- [ ] Get user by ID
- [ ] Get user by wallet address
- [ ] Create user (admin only)
- [ ] Update user
- [ ] Update user points
- [ ] Delete user (admin only)

### ✅ Debris
- [ ] Get all debris
- [ ] Get debris by ID
- [ ] Get debris by catalog ID
- [ ] Get debris by risk score
- [ ] Get debris by location
- [ ] Create debris (admin only)
- [ ] Update debris
- [ ] Delete debris (admin only)

### ✅ Observations
- [ ] Get all observations
- [ ] Get observation by ID
- [ ] Get observations by user
- [ ] Get observations by debris
- [ ] Get pending observations (moderator only)
- [ ] Get approved observations
- [ ] Create observation
- [ ] Update observation
- [ ] Approve observation (moderator only)
- [ ] Reject observation (moderator only)
- [ ] Delete observation

### ✅ Moderations
- [ ] Get all moderations (admin only)
- [ ] Get moderation by ID
- [ ] Get moderations by moderator
- [ ] Get moderation by observation
- [ ] Get moderation stats
- [ ] Create moderation (moderator only)
- [ ] Update moderation (moderator only)
- [ ] Delete moderation (admin only)

### ✅ Blockchain Logs
- [ ] Get all blockchain logs
- [ ] Get blockchain log by ID
- [ ] Get blockchain logs by debris
- [ ] Get blockchain log by transaction
- [ ] Get blockchain logs by block
- [ ] Get blockchain stats
- [ ] Get latest block
- [ ] Create blockchain log (admin only)
- [ ] Update blockchain log (admin only)
- [ ] Delete blockchain log (admin only)

---

## 🚀 Next Steps

1. **Import Collection**: Import file JSON vào Postman
2. **Setup Environment**: Tạo environment với variables
3. **Test Authentication**: Login với các roles khác nhau
4. **Run Test Scenarios**: Chạy các scenarios theo thứ tự
5. **Check Responses**: Verify responses match expected format
6. **Debug Issues**: Sử dụng troubleshooting guide nếu có lỗi

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra server đang chạy trên port 3030
2. Verify database đã được seed
3. Check environment variables
4. Review error messages trong response

**API Base URL**: `http://localhost:3030/api/v1`
**Health Check**: `GET /health`
