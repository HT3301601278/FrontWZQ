# 反应器温度在线监测系统 API 文档

基础URL: http://47.116.66.208:8080/api

## 1. 用户认证

### 1.1 用户登录

- **URL**: `/users/login`
- **方法**: POST
- **描述**: 用户登录并获取认证令牌

#### 请求体

```json
{
  "username": "string",
  "password": "string"
}
```

#### 响应

```json
{
  "token": "string",
  "userId": "string",
  "username": "string"
}
```

#### 测试用例

```
POST http://47.116.66.208:8080/api/users/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

### 1.2 用户注册

- **URL**: `/users/register`
- **方法**: POST
- **描述**: 注册新用户

#### 请求体

```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

#### 响应

```json
{
  "id": "string",
  "username": "string",
  "email": "string"
}
```

#### 测试用例

```
POST http://47.116.66.208:8080/api/users/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "newpassword123",
  "email": "newuser@example.com"
}
```

## 2. 设备管理

### 2.1 获取设备列表

- **URL**: `/devices`
- **方法**: GET
- **描述**: 获取所有设备的列表
- **参数**:
  - `page`: 页码（从0开始）
  - `size`: 每页数量

#### 响应

```json
{
  "content": [
    {
      "id": "string",
      "name": "string",
      "macAddress": "string",
      "communicationChannel": "string",
      "isOn": boolean,
      "threshold": number
    }
  ],
  "totalElements": number,
  "totalPages": number,
  "size": number,
  "number": number
}
```

#### 测试用例

```
GET http://47.116.66.208:8080/api/devices?page=0&size=10
```

### 2.2 添加新设备

- **URL**: `/devices`
- **方法**: POST
- **描述**: 添加新的设备

#### 请求体

```json
{
  "name": "string",
  "macAddress": "string",
  "communicationChannel": "string",
  "threshold": number
}
```

#### 响应

```json
{
  "id": "string",
  "name": "string",
  "macAddress": "string",
  "communicationChannel": "string",
  "isOn": boolean,
  "threshold": number
}
```

#### 测试用例

```
POST http://47.116.66.208:8080/api/devices
Content-Type: application/json

{
  "name": "新反应器",
  "macAddress": "00:11:22:33:44:55",
  "communicationChannel": "WIFI",
  "threshold": 75.5
}
```

### 2.3 获取单个设备详情

- **URL**: `/devices/{id}`
- **方法**: GET
- **描述**: 获取指定ID的设备详情

#### 响应

```json
{
  "id": "string",
  "name": "string",
  "macAddress": "string",
  "communicationChannel": "string",
  "isOn": boolean,
  "threshold": number
}
```

#### 测试用例

```
GET http://47.116.66.208:8080/api/devices/1
```

### 2.4 更新设备信息

- **URL**: `/devices/{id}`
- **方法**: PUT
- **描述**: 更新指定ID的设备信息

#### 请求体

```json
{
  "name": "string",
  "macAddress": "string",
  "communicationChannel": "string",
  "threshold": number
}
```

#### 响应

```json
{
  "id": "string",
  "name": "string",
  "macAddress": "string",
  "communicationChannel": "string",
  "isOn": boolean,
  "threshold": number
}
```

#### 测试用例

```
PUT http://47.116.66.208:8080/api/devices/1
Content-Type: application/json

{
  "name": "更新后的反应器",
  "macAddress": "00:11:22:33:44:55",
  "communicationChannel": "WIFI",
  "threshold": 80.0
}
```

### 2.5 删除设备

- **URL**: `/devices/{id}`
- **方法**: DELETE
- **描述**: 删除指定ID的设备

#### 响应

- 状态码: 204 No Content

#### 测试用例

```
DELETE http://47.116.66.208:8080/api/devices/1
```

### 2.6 切换设备开关状态

- **URL**: `/devices/{id}/toggle`
- **方法**: PUT
- **描述**: 切换指定ID设备的开关状态

#### 响应

```json
{
  "id": "string",
  "name": "string",
  "macAddress": "string",
  "communicationChannel": "string",
  "isOn": boolean,
  "threshold": number
}
```

#### 测试用例

```
PUT http://47.116.66.208:8080/api/devices/1/toggle
```

## 3. 设备数据

### 3.1 获取设备温度数据

- **URL**: `/devices/{id}/data`
- **方法**: GET
- **描述**: 获取指定设备的温度数据
- **参数**:
  - `startTime`: 开始时间（格式：yyyy-MM-dd HH:mm:ss）
  - `endTime`: 结束时间（格式：yyyy-MM-dd HH:mm:ss）
  - `page`: 页码（从0开始）
  - `size`: 每页数量

#### 响应

```json
{
  "content": [
    {
      "id": "string",
      "deviceId": "string",
      "value": number,
      "recordTime": "string"
    }
  ],
  "totalElements": number,
  "totalPages": number,
  "size": number,
  "number": number
}
```

#### 测试用例

```
GET http://47.116.66.208:8080/api/devices/1/data?startTime=2023-01-01 00:00:00&endTime=2023-12-31 23:59:59&page=0&size=10
```

## 4. 警报管理

### 4.1 获取警报列表

- **URL**: `/alerts`
- **方法**: GET
- **描述**: 获取所有警报的列表
- **参数**:
  - `deviceId`: 设备ID（可选）
  - `startTime`: 开始时间（格式：yyyy-MM-dd HH:mm:ss）（可选）
  - `endTime`: 结束时间（格式：yyyy-MM-dd HH:mm:ss）（可选）
  - `page`: 页码（从0开始）
  - `size`: 每页数量

#### 响应

```json
{
  "content": [
    {
      "id": "string",
      "deviceId": "string",
      "deviceName": "string",
      "type": "string",
      "message": "string",
      "status": "string",
      "createdAt": "string"
    }
  ],
  "totalElements": number,
  "totalPages": number,
  "size": number,
  "number": number
}
```

#### 测试用例

```
GET http://47.116.66.208:8080/api/alerts?deviceId=1&startTime=2023-01-01 00:00:00&endTime=2023-12-31 23:59:59&page=0&size=10
```

### 4.2 更新警报状态

- **URL**: `/alerts/{id}`
- **方法**: PUT
- **描述**: 更新指定ID的警报状态

#### 请求体

```json
{
  "status": "string"
}
```

#### 响应

```json
{
  "id": "string",
  "deviceId": "string",
  "deviceName": "string",
  "type": "string",
  "message": "string",
  "status": "string",
  "createdAt": "string"
}
```

#### 测试用例

```
PUT http://47.116.66.208:8080/api/alerts/1
Content-Type: application/json

{
  "status": "RESOLVED"
}
```

## 5. 用户管理

### 5.1 获取当前用户信息

- **URL**: `/users/me`
- **方法**: GET
- **描述**: 获取当前登录用户的信息

#### 响应

```json
{
  "id": "string",
  "username": "string",
  "email": "string"
}
```

#### 测试用例

```
GET http://47.116.66.208:8080/api/users/me
Authorization: Bearer {token}
```

### 5.2 更新用户密码

- **URL**: `/users/password`
- **方法**: PUT
- **描述**: 更新当前登录用户的密码

#### 请求体

```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

#### 响应

- 状态码: 200 OK

#### 测试用例

```
PUT http://47.116.66.208:8080/api/users/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```