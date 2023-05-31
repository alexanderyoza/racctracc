import InfiniteScroll from 'react-infinite-scroller';
import { useInfiniteQuery } from 'react-query';

import Card from './Card';
import "../styles/Feed.css";
import Menu from './Menu';
import Title from './Title';
import axios from 'axios';



function Feed() {

    
    const fetchPosts = async ({ pageParam = 1 }) => {
        let results = null;
        await axios.get('https://racctracc.herokuapp.com/api/uploads/getFeed', {
            headers: {
                'page': pageParam,
                'limit': 10
            }
                
        })
        .then((response) => {
            results = response.data;
        })
        .catch((error) => {
            console.error(error);
        }); 

        let cnt = 0;
        await axios.get('https://racctracc.herokuapp.com/api/uploads/getCount')
        .then((response) => {
            cnt = response.data.count;
            console.log(cnt);
        })
        .catch((error) => {
            console.error(error);
        }); 

        return { results, nextPage: pageParam + 1, totalPages: Math.floor(cnt/10) }
    }; 
    
        const { data, isLoading, isError, hasNextPage, fetchNextPage } = useInfiniteQuery("posts", fetchPosts, { getNextPageParam: (lastPage, pages) => {
            if (lastPage.nextPage < lastPage.totalPages)
                return lastPage.nextPage;
            return undefined;
            }
        });
    return ( 
        <div className='feed-cont'>
            <Title/>
            <div className='feed'> 
                {isLoading ? (
                    <p>Loading...</p>
                ) : isError ? (
                    <p>Error</p>
                ) : ( 
                    <InfiniteScroll className='infinite-scroll' hasMore={hasNextPage} loadMore={fetchNextPage}>
                        {data.pages.map((page) =>
                            page.results.map((post) => <PostCard key={post._id} post={post} />)
                        )}
                    </InfiniteScroll>
                )}
            </div>
            <Menu/>
        </div>
        
      )
    }
    
    export default Feed;
