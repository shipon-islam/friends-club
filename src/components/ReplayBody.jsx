import { motion } from "framer-motion";
import React from "react";

function ReplayBody({ replies }) {
  return (
    <div key={new Date().getTime().toString}>
      {replies.map((item) => (
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5, translateX: -20 }}
            animate={{ opacity: 1, scale: 1, translateX: 0 }}
            transition={{ duration: 0.5 }}
            key={item.id}
            className="flex ml-10 mt-3"
          >
            <img
              className="w-[25px] h-[25px] rounded-full object-cover border-2 border-gray-400"
              src={item.user.avatar}
              alt="user"
            />
            <div className="bg-gray-200 ml-2 py-2 px-6 rounded-md">
              <h5 className="capitalize font-medium text-sm">
                {item.user.username}
              </h5>
              <p className="text-gray-600 text-sm">{item.replayText}</p>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

export default ReplayBody;
