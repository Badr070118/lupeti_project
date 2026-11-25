const messages = new Map([
  ['Invalid credentials', 'E-posta adresi veya şifre hatalı.'],
  ['Email is already registered', 'Bu e-posta adresi zaten kayıtlı.'],
  ['Account is inactive', 'Hesabınız şu anda etkin değil.'],
  ['Insufficient permissions', 'Bu işlem için yetkiniz yok.'],
  ['Cart is empty', 'Sepetiniz boş.'],
  ['Product is not available', 'Bu ürün şu anda satışta değil.'],
  ['Insufficient stock for this product', 'Bu ürün için yeterli stok yok.'],
  ['Quantity must be between 1 and 20', 'Adet 1 ile 20 arasında olmalıdır.'],
  ['Checkout is currently disabled', 'Şu anda sipariş verilemiyor.'],
  ['Order not found', 'Sipariş bulunamadı.'],
  ['Order is not awaiting payment', 'Bu sipariş ödeme beklemiyor.'],
  ['PayTR payments are currently disabled', 'PayTR ile ödeme şu anda kullanılamıyor.'],
  ['Gecersiz istek veya magaza aktif degil', 'Kartla ödeme başlatılamadı. Lütfen tekrar deneyin veya başka bir ödeme yöntemi seçin.'],
  ['Geçersiz istek veya mağaza aktif değil', 'Kartla ödeme başlatılamadı. Lütfen tekrar deneyin veya başka bir ödeme yöntemi seçin.'],
  ['Support is currently disabled', 'Destek hizmeti şu anda kullanılamıyor.'],
  ['Email is required', 'E-posta adresi zorunludur.'],
  ['Category slug already exists', 'Bu kategori URL adı zaten kullanılıyor.'],
  ['Product with same slug or SKU exists', 'Bu URL adıyla veya stok koduyla kayıtlı bir ürün var.'],
  ['At least one admin must remain active', 'En az bir yönetici hesabı etkin kalmalıdır.'],
  ['Image exceeds 5MB limit', 'Görsel boyutu 5 MB sınırını aşıyor.'],
]);

export function apiErrorMessage(status: number, message: unknown, fallback?: string): string {
  if (typeof message === 'string') {
    const translated = messages.get(message);
    if (translated) return translated;
    if (message.startsWith('Insufficient stock for ')) return 'Sepetinizdeki bir ürün için yeterli stok yok.';
  }

  switch (status) {
    case 400:
    case 422:
      return 'Lütfen girdiğiniz bilgileri kontrol edin.';
    case 401:
      return 'Devam etmek için giriş yapın.';
    case 403:
      return 'Bu işlem için yetkiniz yok.';
    case 404:
      return 'Aradığınız kayıt bulunamadı.';
    case 429:
      return 'Çok fazla istek gönderdiniz. Biraz sonra tekrar deneyin.';
    default:
      return fallback ?? 'İşlem tamamlanamadı. Lütfen tekrar deneyin.';
  }
}
