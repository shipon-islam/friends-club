//for comment block expand
export const handleExpandComment = (event) => {
  const thisEle = event.target.parentElement.parentElement;
  const targetEle = thisEle.nextElementSibling;
  targetEle.classList.toggle("hidden");
};
// for three dot modal in status
export const handleThreeDot = (event) => {
  const thisEle = event.target.parentElement;
  const targetEle = thisEle.nextElementSibling;
  targetEle.classList.toggle("hidden");
};
export const handleReportModal = (e) => {
  const targetEle = e.target.nextElementSibling;
  targetEle.classList.toggle("hidden");
};

export const handleReplayExpand = (e) => {
  e.target.nextElementSibling.classList.toggle("hidden");
};
