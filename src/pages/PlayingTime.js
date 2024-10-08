// src/pages/PlayingTime.js

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTable, useSortBy, useFilters } from 'react-table';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';

// Custom default column filter
function DefaultColumnFilter({
  column: { filterValue, setFilter },
}) {
  return (
    <input
      value={filterValue || ''}
      onChange={(e) => setFilter(e.target.value || undefined)}
      placeholder={`Search...`}
      style={{
        width: '100%',
        padding: '5px',
        border: '1px solid lightgray',
      }}
    />
  );
}

const PlayingTime = () => {
  const [playingTime, setPlayingTime] = useState([]);
  const [error, setError] = useState(null);

  const fetchPlayingTime = async () => {
    const token = localStorage.getItem('npsso_code');

    try {
      const response = await axios.get('http://127.0.0.1:5000/api/playing_time');
      setPlayingTime(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Unauthorized response, try to re-authenticate
        const reAuthResponse = await reAuthenticate(token);
        if (reAuthResponse) {
          // Retry fetching the playing time after re-authentication
          fetchPlayingTime();
        } else {
          setError('Failed to authenticate. Please log in again.');
        }
      } else {
        setError('Failed to fetch playing time.');
      }
    }
  };

  // Function to handle re-authentication
  const reAuthenticate = async (token) => {
    try {
      await axios.post('http://127.0.0.1:5000/api/authenticate', {
        npsso_code: token,
      });
      return true; // Re-authentication successful
    } catch (err) {
      return false; // Re-authentication failed
    }
  };

  // Fetch playing time data when component mounts
  useEffect(() => {
    fetchPlayingTime();
  }, []);


  // Force refresh playing time data
  const refreshPlayingTime = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/api/refresh_playing_time');
      fetchPlayingTime();  // Fetch updated data after refresh
    } catch (err) {
      setError('Failed to refresh playing time.');
    }
  };
  // Define columns
  const columns = useMemo(
    () => [
      {
        Header: 'Image',
        accessor: 'image_url', // Access the image URL
        Cell: ({ value }) => (
          <img
            src={value}
            alt="Game"
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          />
        ),
        disableFilters: true, // Disable filters for images
        disableSortBy: true, // Disable sorting for images
      },
      {
        Header: 'Game',
        accessor: 'name', // Access the game name in your API response
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Play Count',
        accessor: 'play_count', // Access the play count
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Play Duration (hours)',
        accessor: 'play_duration', // Access the play duration
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Category',
        accessor: 'category', // Access the game category
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'First Played',
        accessor: 'first_played_date_time', // Access the first played date
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Last Played',
        accessor: 'last_played_date_time', // Access the last played date
        Filter: DefaultColumnFilter,
      },
    ],
    []
  );

  // Use table instance
  const tableInstance = useTable(
    {
      columns,
      data: playingTime,
      defaultColumn: { Filter: DefaultColumnFilter }, // Set default filter for all columns
    },
    useFilters, // Add filter functionality
    useSortBy // Add sorting functionality
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
  } = tableInstance;

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

 
  return (
    <div>
      <h1>Playing Time</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={refreshPlayingTime}>Refresh Data</button>

      <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{
                    borderBottom: '1px solid black',
                    background: '#f0f0f0',
                    color: 'black',
                    fontWeight: 'bold',
                    padding: '10px',
                  }}
                >
                  {column.render('Header')}
                  {/* Add a sort icon */}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <FaSortDown />
                      ) : (
                        <FaSortUp />
                      )
                    ) : (
                      <FaSort />
                    )}
                  </span>
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: '10px',
                      border: '1px solid lightgray',
                    }}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PlayingTime;