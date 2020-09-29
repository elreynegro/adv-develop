(function () {
    'use strict';

    angular
        .module('st.utils')
        .factory('tableManagementService', TableService);

    TableService.$inject = ['$q', '$log', '$filter'];


    function TableService($q, $log, $filter) {

        var logger = $log.getInstance(MODULE_NAME_UTILS_TABLE);


        function TableServiceStub($filter, tableData, perPage) {

            this.currentPage = 0;
            this.pagedItems = [];
            this.sortOrder = '';
            this.itemsPerPage = perPage;
            this.reverse = false;
            this.tableData = tableData;
            this.originalTableData = tableData;

            if (this.itemsPerPage === undefined || this.itemsPerPage === undefined) {
                this.itemsPerPage = 20;
            }

            this.groupToPages = function () {
                this.pagedItems = [];

                for (var i = 0; i < this.tableData.length; i++) {
                    if (i % this.itemsPerPage === 0) {
                        this.pagedItems[Math.floor(i / this.itemsPerPage)] = [this.tableData[i]];
                    } else {
                        this.pagedItems[Math.floor(i / this.itemsPerPage)].push(this.tableData[i]);
                    }
                }
            };

            this.filterBy = function (filter) {
                if (filter !== undefined && filter !== null) {
                    this.tableData = $filter('filter')(this.originalTableData, filter);
                    this.groupToPages();
                    this.currentPage = 0;
                } else {
                    this.tableData = this.originalTableData;
                    this.preparePaginationSorting();
                }
            };

            this.reverse = function (flag) {
                this.reverse = flag;
                this.preparePaginationSorting();
            };

            this.sortBy = function (newSortingOrder) {
                if (this.sortOrder === newSortingOrder) {
                    this.reverse = !this.reverse;
                } else {
                    this.reverse = false;
                }

                this.sortOrder = newSortingOrder;
                if (this.sortOrder !== '') {
                    this.tableData = $filter('orderBy')(this.originalTableData, this.sortOrder, this.reverse);
                    this.groupToPages();
                    this.currentPage = 0;
                }
            };

            this.range = function (start, end) {
                var ret = [];
                if (!end) {
                    end = start;
                    start = 0;
                }
                for (var i = start; i < end; i++) {
                    ret.push(i);
                }
                return ret;
            };

            this.prevPage = function () {
                if (this.currentPage > 0) {
                    this.currentPage--;
                }
            };

            this.nextPage = function () {
                if (this.currentPage < this.pagedItems.length - 1) {
                    this.currentPage++;
                }
            };

            this.setPage = function (n) {
                this.currentPage = n;
            };

            this.preparePaginationSorting = function () {
                this.currentPage = 0;
                this.tableData = $filter('orderBy')(this.originalTableData, this.sortOrder, this.reverse);
                this.groupToPages();
            };

            this.addItem = function (item) {
                this.tableData.push(item);
                this.originalTableData.push(item);
                this.preparePaginationSorting();
            };

            this.preparePaginationSorting();
        };


        return function (tableData, perPage) {
            return new TableServiceStub($filter, tableData, perPage);
        };


    }


}());    