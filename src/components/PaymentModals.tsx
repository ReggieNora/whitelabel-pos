import React, { useEffect, useMemo, useState } from 'react';
import {
  Mic,
  ShoppingCart,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { Product } from '../types/pos';
import { formatCurrency, formatCurrencyExact, getGlobalCurrency, triggerHapticFeedback } from '../utils/localDb';
import {
  ParsedVoiceCommand,
  parseVoiceOrder,
  VOICE_PRESET_PHRASES,
} from '../utils/voiceParser';
import { NativeModal } from './NativeModal';

interface CashModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  initialTendered: number | null;
  onCompleteCash: (cashTendered: number, changeGiven: number) => void;
}

export const CashCheckoutModal: React.FC<CashModalProps> = ({
  isOpen,
  onClose,
  subtotal,
  initialTendered,
  onCompleteCash,
}) => {
  const curSymbol = getGlobalCurrency();
  const standardBills = (curSymbol === '$' || curSymbol === '€' || curSymbol === '£')
    ? [5, 10, 20, 50, 100]
    : [50, 100, 200, 500, 1000];
  const smartPresets = useMemo(
    () => standardBills.filter((bill) => bill > subtotal),
    [subtotal]
  );

  const [tendered, setTendered] = useState<number>(initialTendered || subtotal);
  const [customBill, setCustomBill] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setCustomBill('');
      if (initialTendered && initialTendered >= subtotal) {
        setTendered(initialTendered);
      } else {
        const nextPreset = smartPresets[0] || subtotal;
        setTendered(nextPreset);
      }
    }
  }, [isOpen, subtotal, initialTendered, smartPresets]);

  const change = Math.max(0, tendered - subtotal);
  const isSufficient = tendered >= subtotal && subtotal > 0;

  return (
    <NativeModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cash Payment Engine"
      subtitle="Smart bill presets • Instant sukli calculator"
      accentColor="mint"
    >
      <div className="space-y-4">
        {/* Prominent Total Due & Large Emerald Change Display */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl bg-surface-muted border border-theme p-3.5 shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-muted font-bold block">
              Total Due
            </span>
            <div className="text-2xl font-mono font-bold text-primary mt-1">
              {formatCurrencyExact(subtotal)}
            </div>
            <span className="text-[10px] font-mono text-muted">
              Tendered: {formatCurrencyExact(tendered)}
            </span>
          </div>
          <div className="rounded-2xl bg-surface-muted border border-emerald-btn p-3.5 shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-emerald-btn font-bold block">
              Change Due
            </span>
            <div className="text-3xl font-mono font-black text-emerald-btn mt-0.5 tracking-tight">
              {formatCurrencyExact(change)}
            </div>
            <span className="text-[10px] font-mono text-muted">
              {change === 0 ? 'Exact amount' : 'Return to customer'}
            </span>
          </div>
        </div>

        {/* Smart Bill Preset Buttons (min 56px touch targets) */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">
            Smart Bill Presets (Tap Bill Received)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                triggerHapticFeedback('tap');
                setCustomBill('');
                setTendered(subtotal);
              }}
              className={`min-h-[56px] rounded-xl font-mono font-bold text-xs border transition flex flex-col items-center justify-center px-2 shadow-sm ${
                tendered === subtotal && !customBill
                  ? 'bg-[#2563EB] border-[#2563EB] text-white'
                  : 'bg-surface-muted border-theme text-primary hover:border-slate-400 active:scale-95'
              }`}
            >
              <span>Exact {formatCurrency(subtotal)}</span>
              <span className="text-[10px] opacity-80">No Change</span>
            </button>

            {standardBills.map((bill) => {
              const disabled = bill < subtotal;
              const active = tendered === bill && !customBill;
              return (
                <button
                  key={bill}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    triggerHapticFeedback('tap');
                    setCustomBill('');
                    setTendered(bill);
                  }}
                  className={`min-h-[56px] rounded-xl font-mono font-bold text-base border transition flex flex-col items-center justify-center shadow-sm ${
                    disabled
                      ? 'bg-surface-muted/50 border-theme text-muted/40 cursor-not-allowed'
                      : active
                        ? 'bg-[#2563EB] border-[#2563EB] text-white'
                        : 'bg-surface-muted border-theme text-primary hover:border-slate-400 active:scale-95'
                  }`}
                >
                  <span>{formatCurrency(bill)}</span>
                  {!disabled && (
                    <span
                      className={`text-[10px] font-semibold ${
                        active ? 'text-blue-100' : 'text-emerald-btn'
                      }`}
                    >
                      +{formatCurrency(bill - subtotal)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Cash Input */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={customBill}
            onChange={(e) => {
              setCustomBill(e.target.value);
              const val = parseFloat(e.target.value);
              if (!Number.isNaN(val) && val > 0) {
                setTendered(val);
              }
            }}
            placeholder={`Or enter custom cash amount (${getGlobalCurrency()})...`}
            className="w-full min-h-[48px] rounded-xl bg-surface-muted border border-theme px-3.5 font-mono text-sm text-primary focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        {/* 1-Tap Complete Sale CTA (bg-emerald-btn) */}
        <button
          type="button"
          disabled={!isSufficient}
          onClick={() => {
            triggerHapticFeedback('success');
            onCompleteCash(tendered, change);
          }}
          className="w-full min-h-[58px] rounded-xl bg-emerald-btn hover:opacity-95 text-white font-bold text-base tracking-wide uppercase flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition disabled:opacity-40"
        >
          <Wallet className="w-5 h-5 stroke-[2.25]" />
          <span>
            Complete Sale • Change {formatCurrencyExact(change)}
          </span>
        </button>
      </div>
    </NativeModal>
  );
};

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: Product[];
  onApplyVoiceCommand: (parsed: ParsedVoiceCommand) => void;
}

export const VoiceDictationModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  catalog,
  onApplyVoiceCommand,
}) => {
  const [phrase, setPhrase] = useState(VOICE_PRESET_PHRASES[0]);
  const [isListening, setIsListening] = useState(false);

  const parsed = useMemo<ParsedVoiceCommand>(
    () =>
      isOpen
        ? parseVoiceOrder(phrase, catalog)
        : {
            rawTranscript: phrase,
            matchedItems: [],
            suggestedPaymentMethod: 'CASH',
            customerQuery: null,
            tenderedCash: null,
          },
    [isOpen, phrase, catalog]
  );
  const parsedSubtotal = useMemo(
    () =>
      parsed.matchedItems.reduce(
        (sum, item) => sum + item.product.sellingPrice * item.qty,
        0
      ),
    [parsed.matchedItems]
  );
  const parsedChange =
    parsed.tenderedCash && parsed.tenderedCash >= parsedSubtotal
      ? parsed.tenderedCash - parsedSubtotal
      : null;

  const startBrowserSpeech = () => {
    triggerHapticFeedback('tap');
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const nextPreset =
        VOICE_PRESET_PHRASES[
          (VOICE_PRESET_PHRASES.indexOf(phrase) + 1) % VOICE_PRESET_PHRASES.length
        ];
      setPhrase(nextPreset);
      triggerHapticFeedback('success');
    }, 800);
  };

  return (
    <NativeModal
      isOpen={isOpen}
      onClose={onClose}
      title="Voice Dictation • Taglish NLP"
      subtitle="Speak natural orders + tendered bill for 1-tap checkout"
      accentColor="cyan"
    >
      <div className="space-y-3.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={startBrowserSpeech}
            className={`min-w-[56px] min-h-[56px] rounded-xl flex items-center justify-center border transition ${
              isListening
                ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse'
                : 'bg-[#2563EB] border-[#2563EB] text-white shadow-sm'
            }`}
          >
            <Mic className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="e.g. Two Pantene, one Coke 1.5, paid 100"
            className="w-full min-h-[56px] rounded-xl bg-surface-muted border border-theme px-3 text-sm text-primary font-medium focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted block mb-1.5">
            1-Tap Voice Order Presets
          </span>
          <div className="flex flex-wrap gap-1.5">
            {VOICE_PRESET_PHRASES.slice(0, 3).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  triggerHapticFeedback('tap');
                  setPhrase(preset);
                }}
                className={`text-left text-xs px-2.5 py-2 rounded-lg border transition ${
                  phrase === preset
                    ? 'bg-[#2563EB] border-[#2563EB] text-white font-semibold'
                    : 'bg-surface-muted border-theme text-muted hover:text-primary'
                }`}
              >
                &ldquo;{preset}&rdquo;
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-surface-muted border border-theme p-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1 text-[#2563EB] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Parsed Items ({parsed.matchedItems.length})
            </span>
            <span className="font-mono font-bold text-primary">
              Subtotal: {formatCurrencyExact(parsedSubtotal)}
            </span>
          </div>

          <div className="space-y-1.5">
            {parsed.matchedItems.map(({ product, qty }) => (
              <div
                key={product.id}
                className="flex items-center justify-between text-xs bg-surface border border-theme px-2.5 py-1.5 rounded-lg"
              >
                <span className="font-semibold text-primary">
                  {product.icon} {qty}× {product.shortName}
                </span>
                <span className="font-mono text-emerald-btn font-bold">
                  {formatCurrency(product.sellingPrice * qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-theme flex items-center justify-between text-xs">
            <span className="text-muted">
              Mode:{' '}
              <strong className="text-primary">
                {parsed.suggestedPaymentMethod === 'CARD' ? 'CARD' : 'CASH'}
              </strong>
              {parsed.tenderedCash ? ` (Bill: ${formatCurrency(parsed.tenderedCash)})` : ''}
            </span>
            {parsedChange !== null && (
              <span className="font-mono font-bold text-emerald-btn">
                Change: {formatCurrencyExact(parsedChange)}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          disabled={parsed.matchedItems.length === 0}
          onClick={() => {
            triggerHapticFeedback('success');
            onApplyVoiceCommand(parsed);
          }}
          className="w-full min-h-[56px] rounded-xl bg-emerald-btn hover:opacity-95 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition disabled:opacity-40"
        >
          <ShoppingCart className="w-5 h-5 stroke-[2.25]" />
          <span>Populate Cart &amp; Open Checkout</span>
        </button>
      </div>
    </NativeModal>
  );
};
