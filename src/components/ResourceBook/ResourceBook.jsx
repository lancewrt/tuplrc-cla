import React, { useEffect, useState } from "react";
import "./ResourceBook.css";
import book from "../../assets/OPAC/photos/samplebook.jpg";

const ResourceBook = ({ loading, data }) => {
  const [preview, setPreview] = useState();

  useEffect(() => {
    if (!data) return;

    if (data.type_id != 4) {
      let objectUrl;
      try {
        objectUrl = URL.createObjectURL(data.filepath);
        setPreview(objectUrl);
      } catch {
        if (data.filepath?.includes("http://books.google.com")) {
          setPreview(data.filepath);
        } else {
          setPreview(`https://api.tuplrc-cla.com/${data.filepath}`);
        }
      }

      // Cleanup function to revoke the Object URL
      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }
  }, [data]);

  if (!data) {
    return null;
  }

  // Function to truncate title to 30 characters
  const truncateTitle = (title = "", maxLength = 45) =>
    title.length > maxLength ? title.substring(0, maxLength) + "..." : title;

  // Function to truncate authors to 30 characters
  const truncateAuthor = (authors = "", maxLength = 30) =>
    authors.length > maxLength ? authors.substring(0, maxLength) + "..." : authors;

  return (
    <div className={`resourcebook-box ${loading && "loading-animation"}`}>
      {!loading && (
        <>
          {/* availability */}
          {data && typeof data.resource_quantity !== 'undefined' && (
            <div
              className={`availability text-light position-absolute start-0 p-2
              ${data.resource_quantity === 0 ? 'bg-danger' : 'bg-success'}`}
            >
              {data.resource_quantity === 0 ? 'Borrowed' : 'Available'}
            </div>
          )}
        
          {/* image */}
          <div className="img-box d-flex align-items-center justify-content-center mb-2">
            {preview 
            ? <img src={preview} alt="Book Cover" /> 
            : <div className="thesis-cover d-flex justify-content-between align-items-center text-center">
                <p className="m-0 text-light w-100">{data.resource_title}</p>
              </div>
            }
          </div>
          <p className="m-0 title fw-semibold">{truncateTitle(data.resource_title)}</p>
          <p className="m-0 author fw-semibold">By {truncateAuthor(data.authors === "N/A N/A" || data.authors === "n/a n/a" ? "Unknown Author" : data.authors)}</p>
        </>
      )}
    </div>
  );
};

export default ResourceBook;
