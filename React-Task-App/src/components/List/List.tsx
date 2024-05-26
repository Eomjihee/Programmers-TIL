import React, { FC } from "react";
import { IList, ITask } from "../../types";
import { GrSubtract } from "react-icons/gr";
import Task from "../Task/Task";
import ActionButton from "../ActionButton/DropDownForm/ActionButton";
import { useTypedDispatch } from "../../hooks/redux";
import { deleteList, setModalActive } from "../../store/slices/boardSlice";
import { addLog } from "../../store/slices/loggerSlice";
import { v4 as uuidv4 } from "uuid";
import { setModalData } from "../../store/slices/modalSlice";
import { deleteButton, header, listWrapper, name } from "./List.css";

type TListProps = {
  list: IList;
  boardId: string;
};

const List: FC<TListProps> = ({ list, boardId }) => {
  // store 값을 변경해주기 위해 dispatch 사용
  const dispatch = useTypedDispatch();
  const handleListDelete = (listId: string) => {
    dispatch(deleteList({boardId, listId}));
    addLog({
      logId: uuidv4(),
      logMessage: `Delete List: ${list.listName}`,
      logAuthor: 'hee',
      logTimeStamp: String(Date.now())
    })
  }
  const handleTaskChange = (
    boardId: string, 
    listId: string, 
    taskId: string,
    task: ITask
  ) => {
    dispatch(setModalData({
      boardId,
      listId,
      task
    }));
    dispatch(setModalActive(true));
  }

  return (
    <div
      className={listWrapper}
    >
      <div className={header}>
        <div className={name}>{list.listName}</div>
        {/* icon: - */}
        <GrSubtract 
          className={deleteButton}
          onClick={()=> handleListDelete(list.listId)}
        />
      </div>
      {
        list.tasks.map((task, idx) => (
          <div
            key={task.taskId}
            onClick={()=> handleTaskChange(boardId, list.listId, task.taskId, task)}
          >
            <Task 
              taskName={task.taskName}
              taskDescription={task.taskDescription}
              boardId={boardId}
              id={task.taskId}
              // dnd를 위해 필요
              idx={idx}
            />
          </div>
        ))
      }
      <ActionButton 
        boardId={boardId}
        listId={list.listId}
      />
    </div>
  );
};

export default List;