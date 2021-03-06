import React, { useState, useEffect } from "react";
import axios from "axios";
import apikey from "../../api/apiKey";
import ErrorPage from "../errorPages";
import NowplayingMovies from "./nowplaying";
import UpcomingMovies from "./upcoming";
import TopRatedMovies from "./topRated";
import Loader from "../loader/Loader";
import { HomeWrapper } from "./style";

const Home = () => {
  const [NowPlaying, setNowPlaying] = useState([]);
  const [Upcoming, setUpcoming] = useState([]);
  const [TopRated, setTopRated] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    let source = axios.CancelToken.source();
    const fetchData = async () => {
      try {
        const nowPlayingData = await axios.get(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${apikey}&language=en-US&page=1`,
          {
            cancelToken: source.token,
          }
        );

        const upComingData = await axios.get(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${apikey}&language=en-US&page=1`,
          {
            cancelToken: source.token,
          }
        );

        const topRatedData = await axios.get(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${apikey}&language=en-US&page=1`,
          {
            cancelToken: source.token,
          }
        );

        setNowPlaying(nowPlayingData.data.results.slice(0, 10));
        setUpcoming(upComingData.data.results.slice(0, 10));
        setTopRated(topRatedData.data.results.slice(0, 10));
        setLoading(false);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setError(error);
        }
      }
    };
    fetchData();

    return () => {
      console.log("Component Unmount");
      source.cancel();
    };
  }, []);

  return (
    <React.Fragment>
      {Error && <ErrorPage />}
      {Loading && <Loader />}

      {!Loading && (
        <HomeWrapper>
          <NowplayingMovies movieData={NowPlaying} />
          <UpcomingMovies movieData={Upcoming} />
          <TopRatedMovies movieData={TopRated} />
        </HomeWrapper>
      )}
    </React.Fragment>
  );
};
export default Home;
