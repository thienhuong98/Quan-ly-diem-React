import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import { getUsers, deleteUser } from '../../crud/users.crud';
import { red } from "@material-ui/core/colors";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { getTextLabels } from './_datatable_locale';
import swal from 'sweetalert';
import { toastr } from 'react-redux-toastr';

import Tooltip from "@material-ui/core/Tooltip";
import Avatar from "@material-ui/core/Avatar";
import Done from "@material-ui/icons/Done";
import Clear from '@material-ui/icons/Clear';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import Visibility from '@material-ui/icons/Visibility';
import { Dropdown } from 'react-bootstrap';

export default function Users(props) {
    useEffect(() => {
        document.title = 'Nhân sự';
        // Lay du lieu
        getData();
    }, []);
    const auth = useSelector(state => state.auth);
    const getData = () => {
        getUsers().then((result) => {
            var data = result.data.data;
            setTotal(data.length);
            setData(data);
        })
            .catch((e) => {
                if (!!e.response) {
                    swal({
                        icon: 'error',
                        title: 'Ôi...',
                        text: e.response.data.messages[0],
                    })
                }
                else {
                    swal({
                        icon: 'error',
                        title: 'Ôi...',
                        text: 'Đã có lỗi xảy ra khi kết nối đến server!',
                    })
                }
            });
    }
    const deleteItem = (id) => {

        swal({
            title: "Bạn có chắc chắn?",
            text: "Hãy đảm bảo rằng bạn thực sự muốn xoá",
            icon: "warning",
            buttons: ["Huỷ", "Xoá!"],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    deleteUser(id).then((data) => {
                        swal({
                            icon: 'success',
                            //title: 'O...',
                            text: data.data.messages[0],
                        });
                        getData(); // Lay lai du lieu
                    })
                        .catch((e) => {
                            if (!!e.response) {
                                swal({
                                    icon: 'error',
                                    title: 'Ôi...',
                                    text: e.response.data.messages[0],
                                })
                            }
                            else {
                                swal({
                                    icon: 'error',
                                    title: 'Ôi...',
                                    text: 'Đã có lỗi xảy ra khi kết nối đến server!',
                                })
                            }
                        });
                }
            });

    }
    const getMuiTheme = () => createMuiTheme({
        overrides: {
            MUIDataTableBodyCell: {
                root: {
                    fontSize: "1 rem"
                }
            }
        }
    })
    //const [filters, setFilters] = useState([]);
    const [columns] = useState([
        {
            name: "id", label: "ID",
            // options: {
            //     filterList: filters[0],
            // }
        },
        {
            name: "avatar_url", label: "Avatar",
            options: {
                customBodyRender: (value) => {
                    return <Avatar src={value} className="" alt="Avatar" />
                },
                filter: false,
                sort: false,
            }
        },
        {
            name: "name", label: "Tên"
        },
        {
            name: "gender", label: "Giới tính",
            options: {
                customBodyRender: (value) => {
                    if (value) return <span className="kt-badge kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold">Nam</span>
                    else return <span className="kt-badge kt-badge--unified-danger kt-badge--lg kt-badge--rounded kt-badge--bold">Nữ</span>
                }
            }
        },
        {
            name: "birthday", label: "Ngày sinh"
        },
        {
            name: "phone_number", label: "Số điện thoại"
        },
        {
            name: "email", label: "Email"
        },
        {
            name: "is_admin", label: "Admin",
            options: {
                customBodyRender: (value) => {
                    if (value) {
                        return (
                            <Tooltip title="Có quyền Admin">
                                <Done color="primary" />
                            </Tooltip>
                        );
                    }
                    else {
                        return (
                            <Tooltip title="Không phải là Admin">
                                <Clear style={{ color: red[400] }} />
                            </Tooltip>
                        );
                    }
                }
            }
        },
        {
            name: "is_teacher", label: "Giảng viên",
            options: {
                customBodyRender: (value) => {
                    if (value) {
                        return (
                            <Tooltip title="Là giảng viên của trường">
                                <Done color="primary" />
                            </Tooltip>
                        );
                    }
                    else {
                        return (
                            <Tooltip title="Không phải là giảng viên">
                                <Clear style={{ color: red[400] }} />
                            </Tooltip>
                        );
                    }
                }
            }
        },
        {
            name: "actions", label: "Hành động",
            options:
            {
                customBodyRender: (value, tableMeta, updateValue) => {
                    var path = props.history.location.pathname + "/";
                    return (
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
                                <i class="flaticon-more-1"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Link to={path + tableMeta.rowData[0]} className="dropdown-item" style={{ textDecoration: 'none', color: 'inherit' }}><i className="flaticon-information"></i> Xem</Link>
                                {auth.user.is_admin &&
                                    <>
                                        <Link to={path + tableMeta.rowData[0] + "/edit"} className="dropdown-item" style={{ textDecoration: 'none', color: 'inherit' }}><i className="flaticon-edit"></i> Sửa</Link>
                                        <Link to={"#"} className="dropdown-item" onClick={() => { deleteItem(tableMeta.rowData[0]) }}><i className="flaticon-delete"></i> Xoá</Link>
                                    </>
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    )
                },
                sort: false,
                filter: false
            }
        }
    ]);
    const [data, setData] = useState([]);
    //const [page, setPage] = useState(1);
    const [total, setTotal] = useState(1);
    /*const [params, setParams] = useState(
        {
            "page": 1,
            "per_page": 10,
            "sort_by": "id",
            "order": "asc",
            "search": "",
            "filter": []
        }
    );*/

    const options = {
        fiter: true,
        filterType: 'multiselect',
        selectableRows: 'none',
        //serverSide: true,
        count: total,
        responsive: "scrollFullHeight",
        //rowsPerPage: 10,
        // selectableRows: 'single',
        // selectableRowsOnClick: true,
        // customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
        //     return(
        //         <div style={{float: "right"}}>
        //             <button class="MuiButtonBase-root-579 MuiIconButton-root-570 MUIDataTableToolbarSelect-iconButton-730">
        //                 <Tooltip title="Xem">
        //                     <Visibility fontSize="large" />
        //                 </Tooltip>
        //             </button>

        //             <button class="MuiButtonBase-root-579 MuiIconButton-root-570 MUIDataTableToolbarSelect-iconButton-730">
        //                 <Tooltip title="Sửa">
        //                     <Edit fontSize="large" />
        //                 </Tooltip>
        //             </button>

        //             <button class="MuiButtonBase-root-579 MuiIconButton-root-570 MUIDataTableToolbarSelect-iconButton-730">
        //                 <Tooltip title="Xoá">
        //                     <Delete fontSize="large" />
        //                 </Tooltip>   
        //             </button> 
        //         </div>
        //     )
        // },
        /*onTableChange: (action, tableState) => {
            var newParams = params;
            //console.log(action)
            //console.log(tableState);
            switch (action) {
                case "changePage":
                    newParams.page = tableState.page + 1;
                    setParams(newParams);
                    getData();
                    break;
                case "search":
                    newParams.search = tableState.searchText;
                    setParams(newParams);
                    getData();
                    break;
            }
        },
        onColumnSortChange: (changedColumn, direction) => {
            var newParams = params;
            newParams.sort_by = changedColumn;
            newParams.order = direction === "ascending" ? "asc" : "desc";
            setParams(newParams);
            getData();
        },
        onFilterChange: (changedColumn, filterList) => {
            var newParams = params;
            for(var i = 0; i < columns.length; i++)
            {
                if(!columns[i].options || (!!columns[i].options && columns[i].options.filter === true))
                {
                    if(filterList[i].length != 0) newParams.filter[columns[i].name] = filterList[i];
                }
            }
            setParams(newParams);
            getData();
        },*/
        textLabels: getTextLabels()
    };
    // const getData = () => {
    //     //console.log(params);
    //     axios.get('http://localhost:12237/api/v1/users').then((result) => {
    //         var data = result.data.data;
    //         //var meta = result.data.meta;
    //         setTotal(data.length);
    //         //var columns = [];
    //         // var keys = Object.keys(data[0]);
    //         // for (var i = 0; i < keys.length; i++) {
    //         //     var name = keys[i].replace("_", " ");
    //         //     name = name[0].toUpperCase() + name.slice(1);
    //         //     //columns[i] = { "label": name, "name": keys[i], options: { sortable: true, filter: true } }
    //         // }
    //         //setColumns(columns)
    //         //console.log(columns)
    //         setData(data)
    //     });
    // }
    return (
        <>
            <MuiThemeProvider theme={getMuiTheme()}>
                <MUIDataTable
                    title={"Danh sách nhân sự"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>
        </>
    );
}