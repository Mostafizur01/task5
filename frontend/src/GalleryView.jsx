import "./GalleryView.css"
import InfiniteScroll from 'react-infinite-scroll-component'

const GalleryView = ({ data, fetchMoreData, hasMore }) => {
  return (
    <InfiniteScroll
      dataLength={data.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4 className="loadingM">Loading more...</h4>}
      endMessage={<p>All songs loaded!</p>}
    >
      <div className="gallery-grid">
        {data.map((item) => (
          <div key={item.id} className="gallery-card">
            <div className="album-cover" >
              <img src={item.imageUrl} alt={item.title} className="gImage" />
            </div>
            <div className="card-info">
              <h4>{item.title}</h4>
              <p>{item.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  )
}

export default GalleryView