import React from 'react';
import { useState, useEffect } from 'react';
import { copy, linkIcon, loader, tick } from '../assets';
import useLazyGetSummaryQuery from "../services/article";

const Demo = () => {
  const [article, setArtical] = useState({
    url: "",
    summary: "",
  })

  const [allArticles, setAllArticals] = useState([])

  const [getSummary, {error, isFetching}] = useLazyGetSummaryQuery();

  const [copied, setCopied] = useState("");


  useEffect(() => {
    const articlesFromLocalStoreage = JSON.parse(
      localStorage.getItem('articles')
    )

    if (articlesFromLocalStoreage){
      setAllArticals(articlesFromLocalStoreage)
    }
  }, [])

  const handleSubmit = async(e) =>{
    e.preventDefault();
    const {data} = await getSummary({
      articleUrl: article.url
    });

    if (data?.summary){
      const newArticle = {...article, summary: data.summary};
      const updatedAllArticles = [newArticle, ...allArticles];
      setArtical(newArticle)
      setAllArticals(updatedAllArticles)
      console.log(newArticle)
      localStorage.setItem('articles', JSON.stringify(updatedAllArticles))
    }
  }

  const handleCopy = (copyUrl) =>{
    setCopied(copyUrl)
    navigator.clipboard.writeText(copyUrl)
    setTimeout(() => setCopied(false), 3000)
  }
  

  return (
    <section className='mt-16 w-full max-w-xl'>
      {/* {Search} */}
      <div className='flex flex-col w-full gap-2'>
        <form className='relative flex justify-center items-center' onSubmit={handleSubmit}>
          <img src={linkIcon} alt='Link_icon' className='absolute left-0 my-2 ml-3 w-5'/>
          <input type='url' placeholder='Enter a URL' value={article.url} onChange={(e) => setArtical({...article, url : e.target.value})} required className='url_input peer'/>
          <button type='submit' className='submit_btn 
          peer-focus: border-gray-700 peer-focus:text-gray-700'
          >
          ↵
          </button>
        </form>
        {/* Browse URL History */}
        <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
          {
            allArticles.map((item, index) => (
              <div key = {`link-${index}`} onClick={() => setArtical(item)} className='link_card'>
                <div className='copy_btn' onClick={() => handleCopy(item.url)}>
                  <img src={copied === item.url ? tick : copy} alt='copy_icon' className='w-[40%] h-[30%] object-contain'/>
                </div>
                <p>{item.url}</p>
              </div>
            ))
          }
        </div>
      </div>
      {/* Display Results */}
      <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <img src={loader} alt='loader' className='w-20 h-20 object-contain'/>
        ): error ? (
          <p className='font-inter font-bold text-black text-center'>
            Well, that wasn't supposed to happen...
            <br />
            <span>
              {error?.data?.error}
            </span>
          </p>
        ): (
          article.summary && (
            <div className='flex flex-col gap-3'>
              <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
                Article <span className='blue_gradient'> Summary</span>
              </h2>
              <div className='summary_box'>
                <p className='font-inter font-medium text-sm text-gray-700'>{article.summary}</p>
              </div>
            </div>
          )
        )} 

      </div>
    </section>
  )
}

export default Demo