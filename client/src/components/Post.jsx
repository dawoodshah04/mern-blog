export default function Post() {
    return(
      <div className="post">
        <div className="image">
          <img
          src="https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
        </div>
        <div className="content">
          <h2>Red ferrari 458 italia parked near gray building</h2>
          <p className="info">
            <a  className="author">Dawid Paszko</a>
            <time datetime="">2025-08-23 18:32</time>
          </p>
          <p className="summary">
            The Ferrari 458 Italia (Type F142) is an Italian mid-engine sports
            car produced by Ferrari. The 458 is the successor of the F430.
          </p>
        </div>
      </div>
    );
}