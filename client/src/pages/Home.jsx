import React, { useState, useEffect } from "react";
import { Loader, Card, FormField } from "../components";

const RenderCards = ({ data, title }) => {
  console.log(data);
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          "https://dall-e-clone-mx-version.onrender.com/api/v1/post",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setAllPosts(result.data.reverse());
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setLoading(true);

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );

        setSearchedResults(searchResults);

        setLoading(false);
      }, 500)
    );
  };

  return (
    <section className="max-w-7xl mx-auto">
      <p className="mb-2 text-[#6449ff] text-[16px] text-center">
        by{" "}
        <a
          href="https://twitter.com/carlosdosbe"
          className="text-violet-800 underline"
          target="_blank"
        >
          @carlosdosbe
        </a>
      </p>
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Showcase</h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Encuentra una coleccion increible de imagenes generadas por IA 🤖
        </p>
      </div>

      <div className="mt-6">
        <FormField
          labelName="Buscar post"
          type="text"
          name="text"
          placeholder="coche volador..."
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Resultados de{" "}
                <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards data={searchedResults} title="Sin resultados" />
              ) : (
                <RenderCards data={allPosts} title="No post found" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
