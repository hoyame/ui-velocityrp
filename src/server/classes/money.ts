import {MySQL} from "../core/mysql";

export class Money {
    private data = {
        bank: 0,
        cash: 0,
        dirty: 0,
        fidelcoins: 0
    }

    public get() {
        return this.data;
    }

    public canPay(amount: number) {
        return this.data.cash + this.data.bank >= amount
    }

    public pay(amount: number) {
        if (!this.canPay(amount)) return false;

        let p = amount;

        if (p > 0) {
            let m = Math.min(this.data.cash - p)
            this.data.cash -= m;
        }

        if (p > 0) {
            let m = Math.min(this.data.bank - p)
            this.data.bank -= m;
        }

        return true
    }

    public async grabData() {
        console.log(JSON.stringify(getPlayerIdentifiers(source)))

        const result = await MySQL.QueryAsync(`SELECT accounts FROM users WHERE identifier = ?`, [getPlayerIdentifiers(source)[0]])
        const accounts = JSON.parse(result[0].accounts)

        accounts.map((v: any) => {
            v.name == "cash" ? this.data.cash = v.money : null;
            v.name == "bank" ? this.data.bank = v.money : null;
            v.name == "dirty" ? this.data.dirty = v.money : null;
            v.name == "fidelcoins" ? this.data.fidelcoins = v.money : null;
        })
    }
}

