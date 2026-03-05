export function generateInsights({ today, yesterday }) {
  const insights = [];

  if (!today) {
    return ['No daily data yet. Please input today\'s revenue and customer count.'];
  }

  const avgSpendToday = today.customer_count > 0 ? today.total_revenue / today.customer_count : 0;

  if (yesterday) {
    const avgSpendYesterday =
      yesterday.customer_count > 0 ? yesterday.total_revenue / yesterday.customer_count : 0;

    if (avgSpendToday < avgSpendYesterday) {
      insights.push('Customer spending per person decreased today. Recommend promoting a two-person set meal.');
    }

    if (today.delivery_revenue > yesterday.delivery_revenue * 1.2) {
      insights.push('Delivery growth is strong. Consider adding delivery-only combo deals to improve repeat orders.');
    }

    if (today.dine_in_revenue < yesterday.dine_in_revenue * 0.8) {
      insights.push('Dine-in revenue dropped noticeably. Consider limited-time in-store offers to increase foot traffic.');
    }
  }

  const deliveryRatio = today.total_revenue > 0 ? today.delivery_revenue / today.total_revenue : 0;
  if (deliveryRatio > 0.6) {
    insights.push('Delivery revenue dominates today. Monitor platform commission and optimize menu pricing for margin.');
  }

  if (!insights.length) {
    insights.push('Business performance is stable today. Continue tracking customer count and bundle promotions.');
  }

  return insights;
}
