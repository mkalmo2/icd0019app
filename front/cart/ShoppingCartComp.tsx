import React, { Component } from 'react';
import { CartDao } from './CartDao.ts';
import ProductCartDao from './ProductCartDao.ts';
import ServiceCartDao from './ServiceCartDao.ts';
import CartInfo from "./CartInfo.ts";

type Props = {
    daoType: 'product' | 'service',
    itemName: string
}

interface CartState {
    cart?: CartInfo,
    coupon?: string,
    statusMessage?: string
}

export default class ShoppingCartComp extends Component<Props, CartState> {

    private dao: CartDao;

    constructor(props: Props) {
        super(props);

        this.state = {
            cart: undefined,
            coupon: '',
            statusMessage: ''
        };

        this.dao = props.daoType === 'product'
            ? new ProductCartDao()
            : new ServiceCartDao();

        this.handleCouponChange = this.handleCouponChange.bind(this);
        this.applyCoupon = this.applyCoupon.bind(this);
    }

    async componentDidMount() {
        await this.loadCartContents();
    }

    async loadCartContents() {
        this.setState({ cart: await this.dao.getCartInfo() });
    }

    async handleRemoveItem(itemId: string) {
        let message;
        try {
            await this.dao.removeItem(itemId);
            await this.loadCartContents();
            message = `Item "${itemId}" removed from cart`;
        } catch (error) {
            message = `Error: ${error.message}`;
        }

        this.setState({'statusMessage': message});
    }
    
    async handleIncreaseQuantity(itemId: string) {
        try {
            await this.dao.increaseItemQuantity(itemId);
            await this.loadCartContents();
            this.setState(
                { statusMessage: `Quantity increased for item "${itemId}"`});
        } catch (error) {
            this.setState({ statusMessage: `Error: ${error.message}` });
        }
    }
    
    handleCouponChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ coupon: event.target.value });
    }
    
    async applyCoupon() {
        if (!this.state.coupon) {
            this.setState({ statusMessage: 'Please enter a coupon code' });
            return;
        }
        
        try {
            const response = await this.dao.applyCoupon(this.state.coupon);
            await this.loadCartContents();
            
            if (response.success) {
                this.setState({
                    statusMessage: `Coupon "${this.state.coupon}" successfully applied`, 
                    coupon: '' 
                });
            } else {
                this.setState({
                    statusMessage: `Invalid coupon code "${this.state.coupon}"` 
                });
            }
        } catch (error) {
            this.setState({ statusMessage: `Error: ${error.message}` });
        }
    }

    render() {
        const { cart, coupon, statusMessage } = this.state;
        
        if (!cart) {
            return <div>Loading cart...</div>;
        }
        
        return (
            <div className="shopping-cart">
                <h2>{this.props.itemName} Cart</h2>
                
                {statusMessage && (
                    <div className="alert alert-info alert-dismissible fade show" role="alert">
                        {statusMessage}
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={() => this.setState({ statusMessage: '' })}
                            aria-label="Close">
                        </button>
                    </div>
                )}
                
                {cart.rows.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.rows.map(row => (
                                    <tr key={row.id}>
                                        <td>{row.id}</td>
                                        <td>${row.price.toFixed(2)}</td>
                                        <td>{row.quantity}</td>
                                        <td>${(row.price * row.quantity).toFixed(2)}</td>
                                        <td className="text-end">
                                            <button 
                                                className="btn btn-sm btn-primary mr-2"
                                                onClick={() => this.handleIncreaseQuantity(row.id)}
                                            >
                                                + Add One
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-danger"
                                                onClick={() => this.handleRemoveItem(row.id)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        <div className="cart-summary mt-4">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="coupon-form">
                                        <div className="input-group">
                                            <input 
                                                type="text" 
                                                className="form-control"
                                                placeholder="Coupon code" 
                                                value={coupon}
                                                onChange={this.handleCouponChange}
                                            />
                                            <div className="input-group-append">
                                                <button 
                                                    className="btn btn-outline-secondary" 
                                                    type="button"
                                                    onClick={this.applyCoupon}
                                                >
                                                    Apply Coupon
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="cart-totals">
                                        <div className="d-flex justify-content-between">
                                            <span>Discount:</span>
                                            <span>{cart.totalDiscount.toFixed(2)}%</span>
                                        </div>
                                        <div className="d-flex justify-content-between font-weight-bold">
                                            <span>Total:</span>
                                            <span>${cart.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }
}