import ajax from '../ajax'

function addWish(wish:Partial<WishApiTypes.Wish>):WishApiTypes.addWish {
  return ajax.post(
    '/wish/add', wish,
  )
}

function getDocsWish():WishApiTypes.allDocsWishData {
  return ajax.get('wish/all/docs')
}

function praiseWish(id:string) {
  return ajax.post(`wish/praise/${id}`)
}
export default {
  addWish,
  getDocsWish,
  praiseWish,
}
