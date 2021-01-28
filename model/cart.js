module.exports = function Cart ( oldCart) {
    this.items = oldCart.items ||  {}; // either equal  the previous cart or if none, a new empty cart object is created
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = Math.round(oldCart.totalPrice*100)/100 || 0; // if undefined, take 0

    if(this.totalPrice < 0){
        this.totalPrice = 0;
    }

    this.add = function(item, id) {
        let storedItem = this.items[id]; // Checked if the item is already inside
        if(!storedItem){  //if no match: create an object with the item, the price and the qty and associates it to my new cart
            storedItem = this.items[id] = { item : item, qty : 0, price : 0}
        };
        storedItem.qty++;
        storedItem.price = Math.round(storedItem.item.price * storedItem.qty*100)/100;
        this.totalQty++;
        this.totalPrice +=  Math.round(storedItem.item.price*100)/100;
    }

    this.removeOne = function(id){
        this.items[id].qty --;
        this.items[id].price -= Math.round(this.items[id].item.price*100)/100;
        this.totalQty --;
        this.totalPrice-= Math.round(this.items[id].item.price*100)/100;


        
        if(this.items[id].qty <= 0){
            delete this.items[id];
        }
    }

    this.removeAll= function(id){
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];

    }
// creation of an array with all the objects, if we want to display a list of them later on
    this.generateArray = function(){
        let arr = [];
        for(let id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    }
}