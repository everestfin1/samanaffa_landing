import { db } from '../apps/backend/src/lib/db.js'
import { adminUsers } from '../apps/backend/src/lib/schema.js'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

// Configuration
const adminEmail = 'wadealiou00@gmail.com'
const newPassword = 'admin123' // You can change this

async function resetAdminPassword() {
  try {
    console.log(`🔑 Resetting password for admin: ${adminEmail}`)
    
    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 12)
    console.log('✅ Password hashed successfully')
    
    // Update the admin user's password
    const result = await db
      .update(adminUsers)
      .set({ 
        passwordHash,
        failedAttempts: 0, // Reset failed attempts
        lockedUntil: null, // Unlock account if locked
        updatedAt: new Date()
      })
      .where(eq(adminUsers.email, adminEmail))
      .returning()
    
    if (result.length > 0) {
      console.log(`✅ Password updated for ${adminEmail}`)
      console.log(`📧 Email: ${adminEmail}`)
      console.log(`🔑 New password: ${newPassword}`)
      console.log('\n⚠️  Please change this password after first login!')
    } else {
      console.log(`❌ Admin user not found: ${adminEmail}`)
    }
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error resetting password:', error)
    process.exit(1)
  }
}

resetAdminPassword()
