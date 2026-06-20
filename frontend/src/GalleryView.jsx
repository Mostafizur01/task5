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
            <div className="album-cover" style={{ background: `linear-gradient(45deg, #${Math.floor(Math.random()*16777215).toString(16)}, #333)` }}>
              <h3>{item.title}</h3>
              <p>{item.artist}</p>
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