import React, { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Copy,
  Check,
  Download,
  QrCode,
  Sparkles,
  Share2,
  Eye,
  Globe,
  Heart,
} from 'lucide-react';
import { GiftConfig } from '../types/gift';

interface QrShareModalProps {
  isOpen: boolean;
  giftConfig: GiftConfig;
  isRecipientPreview?: boolean;
  onToggleRecipientPreview?: (val: boolean) => void;
  onClose: () => void;
}

export function getPublicGiftBaseUrl(): string {
  if (typeof window === 'undefined') {
    return 'https://ais-pre-o3fo2fixhojs3sgtu246no-503923172471.asia-east1.run.app';
  }
  const url = new URL(window.location.origin);
  if (url.hostname.startsWith('ais-dev-')) {
    url.hostname = url.hostname.replace(/^ais-dev-/, 'ais-pre-');
  }
  return url.origin;
}

export const QrShareModal: React.FC<QrShareModalProps> = ({
  isOpen,
  giftConfig,
  isRecipientPreview = false,
  onToggleRecipientPreview,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const recipientName = giftConfig.loveLetter?.recipient || 'Em Yêu';
  const signOff = giftConfig.loveLetter?.signature || 'Yêu em rất nhiều ♥';

  const shareableUrl = useMemo(() => {
    try {
      const baseOrigin = getPublicGiftBaseUrl();
      const url = new URL(baseOrigin);
      url.searchParams.set('gift', giftConfig.id || 'danh-tang-em');
      return url.toString();
    } catch {
      return 'https://ais-pre-o3fo2fixhojs3sgtu246no-503923172471.asia-east1.run.app/?gift=danh-tang-em';
    }
  }, [giftConfig.id]);

  const sweetMessageWithLink = useMemo(() => {
    return `Gửi ${recipientName} món quà nhỏ anh chuẩn bị riêng cho em ❤️ Nhớ bật âm thanh và chạm vào bó hoa nhé:\n${shareableUrl}`;
  }, [recipientName, shareableUrl]);

  useEffect(() => {
    if (!isOpen || !qrCanvasRef.current) return;
    QRCode.toCanvas(
      qrCanvasRef.current,
      shareableUrl,
      {
        width: 190,
        margin: 1,
        color: {
          dark: '#1b0524',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      },
      () => {}
    );
  }, [isOpen, shareableUrl]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const input = document.createElement('input');
      input.value = shareableUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyFullMessage = async () => {
    try {
      await navigator.clipboard.writeText(sweetMessageWithLink);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Món Quà Từ Trái Tim — Dành Tặng ${recipientName} ❤️`,
          text: `Chạm để mở bó hoa hồng ánh sáng, xoay quả cầu pha lê kỷ niệm 3D và đọc bức thư anh gửi riêng cho em.`,
          url: shareableUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadQrCard = () => {
    const sourceCanvas = qrCanvasRef.current;
    if (!sourceCanvas) return;

    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 900;
    cardCanvas.height = 1160;
    const ctx = cardCanvas.getContext('2d');
    if (!ctx) return;

    // Deep cosmic gradient background
    const grad = ctx.createLinearGradient(0, 0, 900, 1160);
    grad.addColorStop(0, '#14031c');
    grad.addColorStop(0.5, '#2b0938');
    grad.addColorStop(1, '#12021a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 900, 1160);

    // Subtle glowing radial aura
    const radial = ctx.createRadialGradient(450, 500, 40, 450, 500, 440);
    radial.addColorStop(0, 'rgba(255, 77, 166, 0.38)');
    radial.addColorStop(1, 'rgba(255, 77, 166, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 900, 1160);

    // Decorative outer border
    ctx.strokeStyle = 'rgba(255, 166, 210, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(42, 42, 816, 1076);

    // White QR container box
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(210, 250, 480, 480, 36);
    ctx.fill();

    // Draw QR inside container
    ctx.drawImage(sourceCanvas, 245, 285, 410, 410);

    // Header text
    ctx.fillStyle = '#ffb3d9';
    ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MÓN QUÀ TỪ TRÁI TIM DÀNH TẶNG', 450, 135);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 600 54px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(recipientName, 450, 200);

    // Footer instructions
    ctx.fillStyle = '#ffd6eb';
    ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Quét mã QR bằng Camera điện thoại hoặc Zalo', 450, 820);

    ctx.fillStyle = 'rgba(255, 214, 235, 0.72)';
    ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      'Nhớ bật âm thanh để nghe nhạc và chạm vào bó hoa nhé ❤️',
      450,
      868
    );

    ctx.fillStyle = '#ff85c0';
    ctx.font = 'italic 500 32px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(signOff, 450, 985);

    const dataUrl = cardCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `qr-qua-tang-${recipientName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border border-pink-400/35 bg-gradient-to-b from-[#1e072b]/95 via-[#13041c]/98 to-[#0b0210]/98 p-5 sm:p-6 text-white shadow-[0_24px_80px_rgba(255,42,133,0.38)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/75 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-400/35 bg-pink-500/15 px-3 py-1 text-xs font-medium text-pink-200 mb-2">
            <QrCode className="h-3.5 w-3.5 text-pink-400" />
            <span>Link Công Khai & Mã QR Tặng Quà</span>
          </div>

          <h2 className="font-serif italic text-2xl sm:text-3xl text-white">
            Gửi Tặng {recipientName}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-pink-100/75 max-w-md">
            Khi mở từ link này, các nút chỉnh sửa sẽ tự động ẩn đi để chỉ hiện nút Nhạc, Thư và Xem lại.
          </p>

          {/* QR Code Box */}
          <div className="mt-4 rounded-3xl bg-white p-3.5 shadow-[0_0_45px_rgba(255,77,166,0.4)] border-4 border-pink-300/60">
            <canvas ref={qrCanvasRef} className="block rounded-xl" />
          </div>

          {/* Public Link Copy Box */}
          <div className="mt-4 w-full text-left">
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-pink-300">
                <Globe className="h-3.5 w-3.5 text-pink-400" />
                Link Công Khai (ais-pre)
              </span>
              <span className="text-[11px] text-emerald-300 font-medium">
                ● Đã đồng bộ {giftConfig.memories.length} ảnh/video & nhạc
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-pink-400/30 bg-black/50 p-1.5 pl-3.5">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="w-full bg-transparent text-xs text-pink-100/90 focus:outline-none truncate font-mono"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#ff6bb5] px-3.5 py-2 text-xs font-semibold text-white hover:opacity-95 transition-opacity cursor-pointer shadow-[0_0_15px_rgba(255,42,133,0.5)]"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Đã chép link</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Chép Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Zalo / Messenger Social Card Preview */}
          <div className="mt-4 w-full rounded-2xl border border-white/12 bg-white/[0.04] p-3 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-pink-200/80 flex items-center gap-1">
                <Heart className="h-3 w-3 text-[#ff4da6] fill-[#ff4da6]" />
                Thẻ hiển thị khi gửi Zalo / Messenger:
              </span>
              <button
                type="button"
                onClick={handleCopyFullMessage}
                className="text-[11px] font-semibold text-[#ff85c0] hover:text-white transition-colors cursor-pointer"
              >
                {copiedMessage
                  ? '✓ Đã chép lời nhắn + link'
                  : 'Chép kèm lời nhắn ngọt ngào'}
              </button>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-black/45 border border-pink-500/20 p-2.5">
              <img
                src="/assets/aistudio/image_8d99a6c9.png"
                alt="Preview"
                className="h-14 w-14 rounded-lg object-cover shrink-0 border border-pink-400/30"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  Món Quà Từ Trái Tim — Dành Riêng Cho Em ❤️
                </p>
                <p className="text-[11px] text-pink-100/70 line-clamp-2 mt-0.5">
                  Chạm để mở bó hoa hồng ánh sáng, xoay quả cầu pha lê kỷ niệm 3D và đọc bức thư anh gửi riêng cho em.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
            <button
              type="button"
              onClick={handleDownloadQrCard}
              className="flex items-center justify-center gap-2 rounded-2xl border border-pink-300/35 bg-pink-500/20 py-2.5 px-4 text-xs sm:text-sm font-semibold text-pink-100 hover:bg-pink-500/30 transition-all cursor-pointer"
            >
              <Download className="h-4 w-4 text-pink-300" />
              <span>Tải Thiệp QR (PNG)</span>
            </button>

            <button
              type="button"
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff2a85] to-[#ff5aa4] py-2.5 px-4 text-xs sm:text-sm font-semibold text-white shadow-[0_0_25px_rgba(255,42,133,0.45)] hover:opacity-95 transition-all cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              <span>Chia sẻ ngay</span>
            </button>
          </div>

          {/* Preview Recipient Mode Toggle */}
          {onToggleRecipientPreview && (
            <button
              type="button"
              onClick={() => {
                onToggleRecipientPreview(!isRecipientPreview);
                onClose();
              }}
              className="mt-2.5 w-full flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 py-2 px-4 text-xs font-medium text-pink-200 transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-pink-400" />
              <span>
                {isRecipientPreview
                  ? 'Đang ở chế độ Người Nhận Quà — Bấm để hiện lại nút Chỉnh sửa'
                  : 'Xem thử giao diện của Bạn Gái (Ẩn các nút chỉnh sửa)'}
              </span>
            </button>
          )}

          <div className="mt-3 flex items-start gap-2 rounded-xl bg-pink-950/40 border border-pink-500/25 px-3 py-2 text-left text-[11px] text-pink-200/85">
            <Sparkles className="h-4 w-4 shrink-0 text-pink-400 mt-0.5" />
            <span>
              <strong>Mẹo mở công khai cho mọi người:</strong> Hãy bật công tắc{' '}
              <strong>Public (Công khai)</strong> ở nút{' '}
              <strong>Share / Chia sẻ</strong> góc trên cùng của AI Studio để bất
              kỳ ai bấm vào link <code className="text-pink-300">ais-pre-...</code>{' '}
              hoặc quét QR đều mở được ngay không cần đăng nhập.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
