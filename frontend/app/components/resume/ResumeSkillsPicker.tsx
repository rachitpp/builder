"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Skill {
  id: string;
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  category?: string;
}

interface ResumeSkillsPickerProps {
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
  suggestedSkills?: Skill[];
}

const ResumeSkillsPicker: React.FC<ResumeSkillsPickerProps> = ({
  skills,
  onSkillsChange,
  suggestedSkills = [],
}) => {
  const [newSkillName, setNewSkillName] = useState<string>("");
  const [newSkillLevel, setNewSkillLevel] =
    useState<Skill["level"]>("intermediate");
  const [newSkillCategory, setNewSkillCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [draggedSkill, setDraggedSkill] = useState<Skill | null>(null);

  // Extract unique categories from skills
  useEffect(() => {
    const categories = Array.from(
      new Set(skills.map((skill) => skill.category).filter(Boolean) as string[])
    );
    setUniqueCategories(categories);
  }, [skills]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter skills based on search and category
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name
      .toLowerCase()
      .includes(debouncedSearchTerm.toLowerCase());
    const matchesCategory =
      !activeCategory || skill.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter suggested skills based on search and exclude already added skills
  const filteredSuggestions = suggestedSkills.filter((suggestion) => {
    const matchesSearch = suggestion.name
      .toLowerCase()
      .includes(debouncedSearchTerm.toLowerCase());
    const notAlreadyAdded = !skills.some(
      (skill) => skill.name.toLowerCase() === suggestion.name.toLowerCase()
    );
    return matchesSearch && notAlreadyAdded;
  });

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;

    // Check if skill already exists
    const skillExists = skills.some(
      (skill) => skill.name.toLowerCase() === newSkillName.toLowerCase()
    );

    if (skillExists) {
      // Could show an error message here
      return;
    }

    const newSkill: Skill = {
      id: Date.now().toString(),
      name: newSkillName.trim(),
      level: newSkillLevel,
      category: newSkillCategory || undefined,
    };

    onSkillsChange([...skills, newSkill]);
    setNewSkillName("");
  };

  const handleRemoveSkill = (skillId: string) => {
    onSkillsChange(skills.filter((skill) => skill.id !== skillId));
  };

  const handleUpdateSkillLevel = (skillId: string, level: Skill["level"]) => {
    onSkillsChange(
      skills.map((skill) =>
        skill.id === skillId ? { ...skill, level } : skill
      )
    );
  };

  const handleUpdateSkillCategory = (skillId: string, category: string) => {
    onSkillsChange(
      skills.map((skill) =>
        skill.id === skillId
          ? { ...skill, category: category || undefined }
          : skill
      )
    );
  };

  const handleAddSuggestedSkill = (suggestion: Skill) => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: suggestion.name,
      level: "intermediate",
      category: suggestion.category,
    };

    onSkillsChange([...skills, newSkill]);
  };

  const onDragStart = (skill: Skill) => {
    setDraggedSkill(skill);
  };

  const onDragEnd = () => {
    setDraggedSkill(null);
  };

  const onDrop = (category: string) => {
    if (draggedSkill) {
      handleUpdateSkillCategory(draggedSkill.id, category);
    }
  };

  const levelColorMap = {
    beginner: "bg-blue-100 text-blue-800 border-blue-200",
    intermediate: "bg-green-100 text-green-800 border-green-200",
    advanced: "bg-purple-100 text-purple-800 border-purple-200",
    expert: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="space-y-6">
      {/* Add new skill */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label
              htmlFor="skillName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Skill Name
            </label>
            <input
              type="text"
              id="skillName"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g., JavaScript"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="skillLevel"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Proficiency Level
            </label>
            <select
              id="skillLevel"
              value={newSkillLevel || "intermediate"}
              onChange={(e) =>
                setNewSkillLevel(e.target.value as Skill["level"])
              }
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="skillCategory"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category (Optional)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="skillCategory"
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                placeholder="e.g., Programming"
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors"
                list="categories"
              />
              <datalist id="categories">
                {uniqueCategories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>

              <motion.button
                type="button"
                onClick={handleAddSkill}
                disabled={!newSkillName.trim()}
                className={`px-4 py-2 rounded-lg shadow-sm text-white 
                  ${
                    newSkillName.trim()
                      ? "bg-primary-600 hover:bg-primary-700"
                      : "bg-gray-300 cursor-not-allowed"
                  } transition-colors flex items-center`}
                whileHover={newSkillName.trim() ? { scale: 1.03 } : {}}
                whileTap={newSkillName.trim() ? { scale: 0.97 } : {}}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* My Skills */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">My Skills</h3>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search skills..."
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories filter */}
        {uniqueCategories.length > 0 && (
          <div className="mb-4 overflow-x-auto pb-2">
            <div className="flex space-x-2 min-w-max">
              <motion.button
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === null
                    ? "bg-primary-100 text-primary-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                All Skills
              </motion.button>

              {uniqueCategories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? "bg-primary-100 text-primary-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(category)}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Skills list */}
        {filteredSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {filteredSkills.map((skill) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`flex items-center rounded-lg border px-3 py-1.5 text-sm ${
                    skill.level && levelColorMap[skill.level]
                  }`}
                  draggable
                  onDragStart={() => onDragStart(skill)}
                  onDragEnd={onDragEnd}
                >
                  <span className="font-medium">{skill.name}</span>

                  <div className="relative ml-2 group">
                    <motion.button
                      className="p-1 rounded-full hover:bg-white/30 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.button>

                    <div className="absolute right-0 mt-1 hidden group-hover:block z-10">
                      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-48">
                        <div className="p-2">
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            Level
                          </p>
                          <div className="space-y-1">
                            {[
                              "beginner",
                              "intermediate",
                              "advanced",
                              "expert",
                            ].map((level) => (
                              <button
                                key={level}
                                className={`block w-full text-left px-2 py-1 text-sm rounded ${
                                  skill.level === level
                                    ? "bg-primary-50 text-primary-700"
                                    : "hover:bg-gray-100"
                                }`}
                                onClick={() =>
                                  handleUpdateSkillLevel(
                                    skill.id,
                                    level as Skill["level"]
                                  )
                                }
                              >
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                              </button>
                            ))}
                          </div>

                          <p className="text-xs font-medium text-gray-500 mt-3 mb-1">
                            Category
                          </p>
                          <select
                            value={skill.category || ""}
                            onChange={(e) =>
                              handleUpdateSkillCategory(
                                skill.id,
                                e.target.value
                              )
                            }
                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="">No Category</option>
                            {uniqueCategories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>

                          <div className="border-t border-gray-200 mt-2 pt-2">
                            <button
                              className="block w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                              onClick={() => handleRemoveSkill(skill.id)}
                            >
                              Remove Skill
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    className="ml-1.5 p-1 rounded-full hover:bg-white/30 transition-colors"
                    onClick={() => handleRemoveSkill(skill.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-500">
              {debouncedSearchTerm
                ? "No skills match your search"
                : "No skills added yet. Add your skills above."}
            </p>
          </div>
        )}

        {/* Helper message for categories */}
        {filteredSkills.length > 0 && (
          <p className="text-xs text-gray-500 mt-3">
            Tip: Drag skills to categories to organize them, or click on a skill
            for more options.
          </p>
        )}
      </div>

      {/* Suggested Skills */}
      {filteredSuggestions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Suggested Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {filteredSuggestions.map((suggestion) => (
              <motion.button
                key={suggestion.id}
                onClick={() => handleAddSuggestedSkill(suggestion)}
                className="flex items-center rounded-lg border border-gray-200 px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{suggestion.name}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeSkillsPicker;
