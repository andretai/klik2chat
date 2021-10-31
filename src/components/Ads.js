import React from 'react'

const Ads = () => {

  React.useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, [])

  return (
    <ins className='adsbygoogle'
      style={{ display: 'block' }}
      data-ad-client='pub-9285094871779032'
      data-ad-slot='8471250112'
      data-ad-format='auto' />
  )
}

export default Ads
