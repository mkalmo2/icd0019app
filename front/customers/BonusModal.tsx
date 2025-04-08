import React, { useState } from 'react';

type BonusModalProps = {
    name: string;
    type: string;
    onClose: () => void;
    onCollectBonus: (orderAmount: number, orderDate: string) => void;
}

const BonusModal: React.FC<BonusModalProps> = ({
    name,
    type,
    onClose,
    onCollectBonus
}) => {
    const currentDate = new Date().toISOString().split('T')[0];

    const [orderAmount, setOrderAmount] = useState<number | undefined>(undefined);
    const [orderDate, setOrderDate] = useState<string>(currentDate);

    const handleCollectBonus = () => {
        if (orderAmount) {
            onCollectBonus(orderAmount, orderDate);
        }
    };

    return (
        <div className="modal d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Collect Bonus Points</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <strong>Customer:</strong> {name}&nbsp;
                            <strong>Type:</strong> {type}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="orderAmount" className="form-label">Order Amount</label>
                            <input
                                type="number"
                                className="form-control"
                                id="orderAmount"
                                value={orderAmount || ''}
                                onChange={(e) => setOrderAmount(parseInt(e.target.value))}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="orderDate" className="form-label">Order Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="orderDate"
                                value={orderDate}
                                onChange={(e) => setOrderDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleCollectBonus}
                            disabled={!orderAmount}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BonusModal;
