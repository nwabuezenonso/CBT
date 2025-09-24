export interface Notification {
  id: string
  userId: string
  type: "exam_assigned" | "exam_completed" | "result_available" | "exam_reminder"
  title: string
  message: string
  read: boolean
  createdAt: string
  examId?: string
}

export const notificationService = {
  // Create notification
  createNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">): Notification => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
    }

    const notifications = JSON.parse(localStorage.getItem("cbt_notifications") || "[]")
    notifications.push(newNotification)
    localStorage.setItem("cbt_notifications", JSON.stringify(notifications))

    return newNotification
  },

  // Get notifications for user
  getNotifications: (userId: string): Notification[] => {
    const notifications = JSON.parse(localStorage.getItem("cbt_notifications") || "[]")
    return notifications
      .filter((n: Notification) => n.userId === userId)
      .sort((a: Notification, b: Notification) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  // Mark notification as read
  markAsRead: (notificationId: string): boolean => {
    const notifications = JSON.parse(localStorage.getItem("cbt_notifications") || "[]")
    const index = notifications.findIndex((n: Notification) => n.id === notificationId)

    if (index === -1) return false

    notifications[index].read = true
    localStorage.setItem("cbt_notifications", JSON.stringify(notifications))
    return true
  },

  // Mark all notifications as read for user
  markAllAsRead: (userId: string): boolean => {
    const notifications = JSON.parse(localStorage.getItem("cbt_notifications") || "[]")
    let updated = false

    notifications.forEach((n: Notification) => {
      if (n.userId === userId && !n.read) {
        n.read = true
        updated = true
      }
    })

    if (updated) {
      localStorage.setItem("cbt_notifications", JSON.stringify(notifications))
    }

    return updated
  },

  // Get unread count
  getUnreadCount: (userId: string): number => {
    const notifications = JSON.parse(localStorage.getItem("cbt_notifications") || "[]")
    return notifications.filter((n: Notification) => n.userId === userId && !n.read).length
  },

  // Helper functions for common notifications
  notifyExamAssigned: (studentId: string, examTitle: string, examId: string) => {
    return notificationService.createNotification({
      userId: studentId,
      type: "exam_assigned",
      title: "New Exam Assigned",
      message: `You have been assigned to take "${examTitle}". Click to view details.`,
      examId,
    })
  },

  notifyExamCompleted: (adminId: string, studentName: string, examTitle: string, score: number) => {
    return notificationService.createNotification({
      userId: adminId,
      type: "exam_completed",
      title: "Exam Completed",
      message: `${studentName} has completed "${examTitle}" with a score of ${score}%.`,
    })
  },

  notifyResultAvailable: (studentId: string, examTitle: string, score: number) => {
    return notificationService.createNotification({
      userId: studentId,
      type: "result_available",
      title: "Exam Result Available",
      message: `Your result for "${examTitle}" is now available. You scored ${score}%.`,
    })
  },

  // Simulate email/SMS notifications (in a real app, this would integrate with email/SMS services)
  sendEmailNotification: (email: string, subject: string, message: string) => {
    console.log(`[EMAIL] To: ${email}, Subject: ${subject}, Message: ${message}`)
    // In a real application, integrate with services like SendGrid, AWS SES, etc.
  },

  sendSMSNotification: (phone: string, message: string) => {
    console.log(`[SMS] To: ${phone}, Message: ${message}`)
    // In a real application, integrate with services like Twilio, AWS SNS, etc.
  },
}
