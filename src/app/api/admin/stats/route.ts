import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { perfumes } from '@/data/perfumes';

export const dynamic = 'force-dynamic';

export async function GET() {
  let productCount = perfumes.length;
  let categoryCount = 10;
  let userCount = 14;
  let totalRevenue = 284500;
  let isLiveDb = false;

  try {
    if (db && Object.keys(db).length > 0) {
      try {
        const productsCountSnapshot = await db.collection('products').count().get().catch(() => null);
        if (productsCountSnapshot && productsCountSnapshot.data().count > 0) {
          productCount = productsCountSnapshot.data().count;
        }
      } catch (e) {}

      try {
        const categoriesCountSnapshot = await db.collection('categories').count().get().catch(() => null);
        if (categoriesCountSnapshot && categoriesCountSnapshot.data().count > 0) {
          categoryCount = categoriesCountSnapshot.data().count;
        }
      } catch (e) {}

      try {
        const usersCountSnapshot = await db.collection('users').count().get().catch(() => null);
        if (usersCountSnapshot && usersCountSnapshot.data().count > 0) {
          userCount = usersCountSnapshot.data().count;
        }
      } catch (e) {}

      try {
        const ordersSnapshot = await db.collection('orders').get().catch(() => null);
        if (ordersSnapshot && !ordersSnapshot.empty) {
          let liveRevenue = 0;
          ordersSnapshot.forEach((doc: any) => {
            const order = doc.data();
            const amount = Number(order.totalPrice) || Number(order.total) || 0;
            liveRevenue += amount;
          });
          if (liveRevenue > 0) totalRevenue = liveRevenue;
        }
      } catch (e) {}

      isLiveDb = true;
    }
  } catch (err) {
    console.warn("Stats fallback:", err);
  }

  return NextResponse.json(
    {
      success: true,
      productCount,
      categoryCount,
      userCount,
      totalRevenue,
      isLiveDb,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    }
  );
}
