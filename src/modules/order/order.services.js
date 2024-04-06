import { Cart } from "../../../DB/model/cart.model.js"
import { Product } from "../../../DB/model/product.model.js"

export const updateStock=async(products,createOrder)=>{
    if(createOrder){
        for (const product of products){
            await Product.findByIdAndUpdate(product.productId,{
                $inc:{  
                    solidItem:product.quantity,
                    avaliableItems:-product.quantity,
                }
            })
        }
    }else{
        for (const product of products){
            await Product.findByIdAndUpdate(product.productId,{
                $inc:{  
                    solidItem:-product.quantity,
                    avaliableItems:product.quantity,
                }
            })
        }
    }
}

export const clearCart =async(userId)=>{
    await Cart.findOneAndUpdate({user:userId},{products:[]})
}

