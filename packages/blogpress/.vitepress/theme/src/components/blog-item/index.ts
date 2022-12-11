import { formatDate } from "../../utils"

export function formatShowDate(date:Date|string){
    const source = +new Date(date)
    const now = +new Date()
    const diff = now - source
    const oneSeconds = 1000
    const oneMinute = oneSeconds * 60
    const oneHour = oneMinute * 60
    const oneDay = oneHour * 24
    const oneWeek = oneDay * 7
    if(diff < oneMinute){
        return Math.floor(diff / oneSeconds) + '秒前'
    }
    else if(diff < oneHour){
        return Math.floor(diff / oneMinute) + '分钟前'
    }
    else if(diff < oneDay){
        return Math.floor(diff / oneHour) + '小时前'
    }
    else if(diff < oneWeek){
        return Math.floor(diff / oneDay) + '天前'
    }
    else{   
        return formatDate(new Date(date), 'yyyy-MM-dd')
    }
}