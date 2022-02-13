//Получение данных со стороннего api
async function getData(url) {
    const response = await fetch(url);
    const data = await response.json()
    return data;
}

//Изменение формата постов.
//userName - имя пользователя для которого добавляем комментарии к постам
async function getModifiedPost(user,userName,posts) {
    const modifiedFilterPost =  await Promise.all(posts.filter( post => post.userId == user.id)
    .map( async post => {
            const data =   {
                id: post.id,
                title: post.title,
                title_crop: `${post.title.substr(0, 20)}...`,
                body:post.body,  
            }
            if(user.name === userName){
                const comments = await getData(`http://jsonplaceholder.typicode.com/posts/${post.id}/comments`) ;
                data.comments = comments      
                } 
            return data
        })
    );
    return modifiedFilterPost;  
}

// Изменение формата данных о users
async function getModifiedUsersWithPosts( users, posts) {
        const newFormatUsers =  await Promise.all (users.map(async (user) => {
            const postModified = await getModifiedPost(user,"Ervin Howell", posts);
            return ({
                id:user.id,
                name: user.name,
                address: `${user.address.city}, ${user.address.street}, ${user.address.suite}`,
                website: `https://${user.website}`,
                company: user.company.name,
                posts: postModified 
            })
        })
    );
    return newFormatUsers 
}

//получение информации о пользователях после преобразований
async function getInfo() {
    const users = await getData('http://jsonplaceholder.typicode.com/users');
    const posts = await getData('http://jsonplaceholder.typicode.com/posts');   
    const usersModified =  await getModifiedUsersWithPosts(users, posts);
    return usersModified ;  
}

getInfo().then( data => console.log(data))






