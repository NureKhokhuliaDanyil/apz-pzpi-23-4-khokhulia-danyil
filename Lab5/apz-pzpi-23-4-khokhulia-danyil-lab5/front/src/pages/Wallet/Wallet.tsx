import Toast from '../../components/Toast';
import { useWallet } from './useWallet';
import styles from './Wallet.module.css';

export default function Wallet() {
  const {
    t,
    depositAmount, setDepositAmount,
    promoCode, setPromoCode,
    msg, setMsg,
    transactions, isLoading,
    depositMutation, promoMutation,
    handleDeposit, handlePromo,
    balance
  } = useWallet();

  return (
    <div className="animate-fade-in">
      <h1 className="page-title mb-6">{t('wallet.title')}</h1>

      {msg && <Toast type={msg.type} message={msg.text} onClose={() => setMsg(null)} />}

      <div className="grid-2">
        <div className="flex-col gap-6">
          <div className={styles.balanceDisplay}>
            <div className={styles.balanceAmount}>{balance.toFixed(2)} {t('wallet.currency')}</div>
            <div className={styles.balanceLabel}>{t('wallet.balance')}</div>
          </div>

          <div className="card">
            <h3 className="card-title mb-4">{t('wallet.deposit')}</h3>
            <form onSubmit={handleDeposit} className="flex-col gap-4">
              <div className="input-group">
                <label>{t('wallet.deposit_amount')}</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  className="input"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={depositMutation.isPending}>
                {t('wallet.deposit_btn')}
              </button>
            </form>
          </div>

          <div className="card mt-6">
            <h3 className="card-title mb-4">{t('wallet.promo_title')}</h3>
            <form onSubmit={handlePromo} className="flex-col gap-4">
              <div className="input-group">
                <input
                  type="text"
                  className="input"
                  placeholder={t('wallet.promo_placeholder')}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-secondary" disabled={promoMutation.isPending}>
                {t('wallet.apply_btn')}
              </button>
            </form>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title mb-4">{t('wallet.transactions')}</h3>
          {isLoading ? <div className="spinner" /> : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>{t('wallet.tx_date')}</th>
                    <th>{t('wallet.tx_type')}</th>
                    <th>{t('wallet.tx_amount')}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions?.length ? transactions.map((tx: any) => (
                    <tr key={tx.id}>
                      <td>{new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'short' }).format(new Date(tx.timestamp))}</td>
                      <td>
                        <span className={`badge ${tx.type === 1 ? 'badge-success' : 'badge-primary'}`}>
                          {tx.type === 1 ? 'Deposit' : 'Payment'}
                        </span>
                      </td>
                      <td className={tx.type === 1 ? styles.txAmountPos : styles.txAmountNeg}>
                        {tx.type === 1 ? '+' : '-'}{tx.amount.toFixed(2)} {t('wallet.currency')}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3} className="text-center text-muted py-4">{t('wallet.no_transactions')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
