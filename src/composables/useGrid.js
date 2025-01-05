import { computed } from 'vue';

export function useGrid(grades) {
    const columnDefs = [
        {
            headerName: 'Subject',
            field: 'subjectName',
            sortable: true,
            filter: true,
            editable: true
        },
        {
            headerName: 'Grade',
            field: 'grade',
            sortable: true,
            filter: 'agNumberColumnFilter',
            cellRenderer: (params) => {
                const grade = params.value;
                let className = 'px-2 py-1 rounded font-semibold';

                if (grade >= 5) className += ' bg-green-200 text-green-800';
                else if (grade >= 4) className += ' bg-yellow-200 text-yellow-800';
                else if (grade >= 3) className += ' bg-orange-200 text-orange-800';
                else className += ' bg-red-200 text-red-800';

                return `<span class="${className}">${grade}</span>`;
            }
        },
        {
            headerName: 'Comment',
            field: 'comment',
            editable: true
        },
        {
            headerName: 'Date',
            field: 'dateOfReceipt',
            sortable: true,
            valueFormatter: (params) => {
                return new Date(params.value).toLocaleDateString();
            }
        },
        {
            headerName: 'Actions',
            field: 'Actions',
            cellRenderer: () => {
                return `
          <div class="flex justify-center space-x-2">
            <button class="edit-btn text-blue-500 hover:text-blue-700">Edit</button>
            <button class="delete-btn text-red-500 hover:text-red-700">Delete</button>
          </div>
        `;
            },
            cellClass: 'flex justify-center items-center',
            width: 150,
            sortable: false,
            filter: false
        }
    ];

    const onCellClicked = (params, emit) => {
        if (params.column.getColId() === 'Actions') {
            const clickedElement = params.event.target;
            if (clickedElement.classList.contains('edit-btn')) {
                emit('edit-grade', params.data);
            } else if (clickedElement.classList.contains('delete-btn')) {
                if (confirm('Are you sure you want to delete this grade?'))
                emit('delete-grade', params.data.gradeId);
            }
        }
    };

    return {
        columnDefs,
        onCellClicked
    };

}

export const defaultColDef = {
    flex: 1,
    minWidth: 100,
    filter: true,
    resizable: true,
}