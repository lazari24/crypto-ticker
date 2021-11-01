import {observer} from "mobx-react-lite";
import CoinTableStore from "./CoinTableStore";

export const CoinTables = observer(() => {
    const {coins} = CoinTableStore;
    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Coins</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>

                {Object.keys(coins).map((coin, idx) => (
                    <tr key={coin}>
                        <td>{idx + 1}.</td>
                        <td>{coins[coin].symbol}</td>
                        <td>{coins[coin].priceUsd}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
});
