import { useEffect } from "react";
import { useAppDispatch } from "../../../hooks/reduxTypeScriptHooks";
import { setGroupId } from "../groupIdSlice";

export const useDispatchGroupID = (id:string) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(
          setGroupId({
            groupId: id,
          })
        );
      }, [dispatch, id]);
}