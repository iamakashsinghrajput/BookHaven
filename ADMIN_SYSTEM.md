# Admin System Documentation

## 🔐 Admin Access Credentials

**For the site owner only:**

- **Username**: `admin` or `admin@bookhaven.com`
- **Password**: `admin123`
- **Role**: `superadmin`

## 🎯 Admin Privileges

### **1. Free Access to All Papers**
- **No payment required** for any question paper
- **Direct download** access to all papers (both external URLs and user-uploaded files)
- Button shows **"Admin Download (Free)"** instead of "Pay ₹10 & Download"

### **2. Paper Approval System**
- **Manual approval required**: Users upload papers but get rewards only after your approval
- **₹4 reward per approved paper**: Automatic reward creation when you approve
- **Approve/Reject buttons**: Easy one-click approval system
- **Status tracking**: Clear visual indicators for pending vs approved papers
- **📧 Email notifications**: Get instant email alerts for new uploads at `akash21052000singh@gmail.com`

### **3. Email Notification System**
- **📬 Admin notifications**: Instant email when users upload papers
- **📧 User notifications**: Automatic emails for upload confirmation, approval/rejection
- **💰 Reward notifications**: Users get notified about their ₹4 rewards
- **📱 Professional templates**: HTML emails with BookHaven branding
- **📊 Complete workflow**: From upload notification to reward confirmation

### **4. Admin Dashboard** (`/admin/dashboard`)
- **Enhanced Upload Statistics**:
  - Total uploads, pending approval count, approved papers
  - Unique users, total rewards distributed
  - Clear breakdown of papers needing your attention
- **Paper Management**: View all user-uploaded papers with:
  - Paper title, uploader info, upload date
  - Download/view counts, approval status
  - **"Approve & Give ₹4"** and **"Reject"** buttons
  - Direct download access to all papers
- **Reward System Management**:
  - View all user rewards (₹4 per approved paper)
  - Update reward status (approved → paid)
  - Track total rewards distributed vs pending payments

### **5. Visual Indicators**
- **Header Dropdown**: Shows "ADMIN ACCESS" badge when logged in as admin
- **Admin Dashboard Link**: Direct access to admin panel from header
- **Different Button Text**: Payment buttons show admin-specific text

### **6. Admin-Only API Endpoints**
- `/api/admin/uploaded-papers` - Get all user uploads
- `/api/admin/user-rewards` - Get all user rewards
- `/api/admin/approve-paper` - **NEW**: Approve papers and create ₹4 rewards
- `/api/admin/update-reward-status` - Update reward payment status
- `/api/admin/direct-download` - Direct paper downloads without payment

## 🚀 How to Use

### **Login as Admin:**
1. Go to `/signin`
2. Select **"Admin"** from the user type buttons
3. Enter credentials: `admin` / `admin123`
4. Click **Login**

### **Access Admin Features:**
- **Free Downloads**: Click any "Admin Download (Free)" button on papers
- **Admin Dashboard**: Click profile dropdown → "Admin Dashboard"
- **📧 Email Notifications**: Get instant emails at `akash21052000singh@gmail.com` for new uploads
- **Approve Papers**: Click "Approve & Give ₹4" to approve papers and create rewards (user gets email)
- **Reject Papers**: Click "Reject" to reject inappropriate papers (user gets email)
- **Manage Rewards**: View and update user reward payment statuses (approved → paid)
- **Monitor Statistics**: See pending approvals, approved papers, and reward totals

## 🛡️ Security Features

- **Role-based authentication** with NextAuth.js
- **Admin-only routes** with middleware protection
- **Secure password hashing** with bcryptjs
- **Session-based access control**

## 💡 Key Benefits

1. **Complete Administrative Control**: Full access to all platform content
2. **Financial Oversight**: Manage user rewards and payments
3. **Content Management**: Monitor and approve user uploads
4. **Usage Analytics**: Track platform statistics and user engagement

---

**Note**: This admin system is designed for the site owner only. Admin credentials should be kept secure and not shared with regular users.