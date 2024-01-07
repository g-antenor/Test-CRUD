import { useEffect, useRef, useState } from "react"

const DataTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({ name: "", gender: "", age: "" });
  const [editId, setEditId] = useState(false);
  const [data, setData] = useState([]);
  
  let filteredItems = data.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  const outsideClick = useRef(false);
  const itemsPerPage = 5;
  const lastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = lastItem - itemsPerPage;
  const filteredData = filteredItems.slice(indexOfFirstItem, lastItem);

  // Effects
  useEffect(() => {
    if(!editId) {
      return;
    };

    let selectedItem = document.querySelectorAll(`[id='${editId}']`);
    selectedItem[0].focus();
  }, [editId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if(outsideClick.current && !outsideClick.current.contains(event.target)) {
        setEditId(false);
      };
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handles
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const hendleAddClick = () => {
    if(formData.name && formData.gender && formData.age) {
      const newItem = {
        id: Date.now(),
        name: formData.name,
        gender: formData.gender,
        age: formData.age,
      };
      setData([...data, newItem]);
      setFormData({ name: "", gender: "", age: "" });
    }
  };

  const handleDelete = (id) => {
    if(filteredData.length === 1 && currentPage !== 1) {
      setCurrentPage((prev) => prev - 1);
    }

    const updateList = data.filter((item) => item.id !== id);
    setData(updateList)
  };

  const handleEdit = (id, updateData) => {
    if(!editId || editId !== id) {
      return;
    }

    const updatedList = data.map((item) => item.id === id ? {...item, ...updateData} : item);
    setData(updatedList);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  return (
    <section className="container">
      <div className="filter-field-top">
        <div className="filter-field">
          <input 
            type="text" 
            name="name" 
            className="name-fild" 
            placeholder="Name" 
            value={formData.name} 
            onChange={handleInputChange}/>
          <input 
            type="text" 
            name="gender" 
            className="gender-fild" 
            placeholder="Gender" 
            value={formData.gender} 
            onChange={handleInputChange}/>
          <input 
            type="text" 
            name="age" 
            className="age-fild" 
            placeholder="Age" 
            value={formData.age} 
            onChange={handleInputChange}/>
        </div>
        <button className="add-btn" onClick={hendleAddClick}>ADD</button>
      </div>
      <div className="table-field">
        <div className="input-field">
          <input type="text" name="search" className="search-fild" placeholder="Search by name" value={searchTerm} onChange={handleSearch}/>
        </div>
        <div className="table-data">
          <table ref={outsideClick}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td 
                  id={item.id} 
                  contentEditable={editId === item.id}
                  onBlur={(e) => handleEdit(item.id, {name: e.target.innerText})}>{item.name}</td>
                  <td 
                  id={item.id} 
                  contentEditable={editId === item.id}
                  onBlur={(e) => handleEdit(item.id, {gender: e.target.innerText})}>{item.gender}</td>
                  <td 
                  id={item.id} 
                  contentEditable={editId === item.id}
                  onBlur={(e) => handleEdit(item.id, {age: e.target.innerText})}>{item.age}</td>
                  <td>
                    <button className="edit btn" onClick={() => setEditId(item.id)}>Edit</button>
                    <button className="delet btn" onClick={() => handleDelete(item.id)}>Delet</button>
                  </td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }, (_, index) => (
            <button className="btn_pageList" key={index+1} onClick={() => paginate(index+1)}>{index+1}</button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DataTable