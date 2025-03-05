import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const onStockUpdate = functions.firestore.onDocumentUpdated('inventory/{itemId}', async (event) => {
  const newData = event.data?.after?.data();
  const previousData = event.data?.before?.data();

  if (!newData || !previousData) return;

  // Check if item was restocked
  if (newData.quantity > previousData.quantity) {
    // Get all notifications subscriptions for this item
    const subscriptionsSnapshot = await admin
      .firestore()
      .collection('notifications')
      .where('itemId', '==', event.params.itemId)
      .get();

    const notifications = subscriptionsSnapshot.docs.map(async (doc) => {
      const subscription = doc.data();
      
      // Get user's email
      const userDoc = await admin
        .firestore()
        .collection('users')
        .doc(subscription.userId)
        .get();
      
      const user = userDoc.data();

      if (user?.email) {
        // Send email notification
        await admin.firestore().collection('mail').add({
          to: user.email,
          message: {
            subject: 'Item Restocked!',
            text: `${newData.name} is now back in stock!`,
            html: `
              <h2>Item Restocked!</h2>
              <p>${newData.name} is now back in stock!</p>
              <p>Current quantity: ${newData.quantity}</p>
            `,
          },
        });
      }
    });

    await Promise.all(notifications);
  }
});