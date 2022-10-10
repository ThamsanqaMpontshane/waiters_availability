function checkCashRegister(price, cash, cid) {
    let change = cash - price;
    let changeArr = [];
    let totalCid = 0;
    let currency = {
        "PENNY": 0.01,
        "NICKEL": 0.05,
        "DIME": 0.1,
        "QUARTER": 0.25,
        "ONE": 1,
        "FIVE": 5,
        "TEN": 10,
        "TWENTY": 20,
        "ONE HUNDRED": 100
    }
    for (let i = 0; i < cid.length; i++) {
        totalCid += cid[i][1];
    }
    totalCid = totalCid.toFixed(2);
    if (totalCid < change) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    } else if (totalCid == change) {
        return { status: "CLOSED", change: cid };
    } else {
        cid = cid.reverse();
        for (let i = 0; i < cid.length; i++) {
            let temp = [cid[i][0], 0];
            while (change >= currency[cid[i][0]] && cid[i][1] > 0) {
                temp[1] += currency[cid[i][0]];
                change -= currency[cid[i][0]];
                change = change.toFixed(2);
                cid[i][1] -= currency[cid[i][0]];
                cid[i][1] = cid[i][1].toFixed(2);
            }
            if (temp[1] > 0) {
                changeArr.push(temp);
            }
        }
    }
    if (change > 0) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }
    return { status: "OPEN", change: changeArr };
}

  checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);

  console.log(checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]));