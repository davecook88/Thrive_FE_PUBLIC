import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ApiAdaptor from "../../../../backend/apiAdaptor";
import { showToast } from "../../../common/alerts/toastSlice";
import { StandardButton } from "../../../styled/Buttons";
import {
  FormSection,
  StandardForm,
  StandardFormBody,
} from "../../../styled/Form";

import { useAppDispatch } from "../../../redux/hooks";
import { LevelResponse } from "../../../types/level/response";
import InputSlider from "../../course/CourseForm/InputSlider";
import { addError, clearErrors } from "../../adminSlice";

interface LevelFormProps {
  level?: LevelResponse;
  refresh: () => void;
}

const LevelForm: React.FC<LevelFormProps> = ({ level, refresh }) => {
  const router = useRouter();

  // FORM VALUES
  const [name, setName] = useState<string>(level?.name || "");
  const [title, setTitle] = useState<string>(level?.title || "");
  const [subtitle, setSubtitle] = useState<string>(level?.subtitle || "");

  const [description, setDescription] = useState<string>(
    level?.description || ""
  );
  const [difficulty, setDifficulty] = useState<number>(level?.difficulty || 0);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearErrors());
  }, [level]);

  const addValidationError = (error: string, callback?: () => void) => {
    dispatch(addError({ error }));
    if (callback) callback();
  };

  const displayToast = (message: string) => {
    dispatch(
      showToast({
        message,
      })
    );
  };
  const formIsValid = () => {
    let valid = true;
    if (!description)
      addValidationError("Please add a description", () => (valid = false));
    if (!name) addValidationError("Please add a name", () => (valid = false));
    if (!title) addValidationError("Please add a title", () => (valid = false));
    return valid;
  };

  const onSubmitLevel = () => {
    if (!formIsValid()) return;
    if (!level) createLevel();
    else updateLevel(level);
    refresh();
  };

  const createLevel = async () => {
    const newLevel = await ApiAdaptor.postLevel({
      name,
      description,
      difficulty: difficulty,
      title: title,
      subtitle,
    });
    displayToast("Level created!");
    setTimeout(() => {
      router.push(`/admin/level/${newLevel.id}`);
    }, 300);
  };

  const updateLevel = async (level: LevelResponse) => {
    const updatedLevel = await ApiAdaptor.putLevel(level.id, {
      name,
      description,
      difficulty: difficulty,
      title: title,
      subtitle,
    });
    displayToast("Level updated!");
    // dispatch(setSelectedCourse({ selectedCourse: updatedLevel }));
  };

  const deleteCourse = async (levelId: number, levelName: string) => {
    await ApiAdaptor.deleteLevel(levelId);
    displayToast(`Level ${levelName} deleted`);
    router.push("/admin");
  };

  return (
    <StandardForm>
      <StandardFormBody>
        {level && (
          <StandardButton
            className="btn-primary md:col-start-2"
            onClick={() => router.push("/admin/level")}
          >
            Add New Level
          </StandardButton>
        )}
        <FormSection className="md:col-start-2">
          <div className="p-2">
            <label className="input-group">
              <span className="text-xs bg-secondary">Level Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name your Level"
                className="input input-bordered w-full"
              />
            </label>
          </div>
          <div className="p-2">
            <label className="input-group">
              <span className="text-xs bg-secondary">
                Level Title - I want to...
              </span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="A descriptive title"
                className="input input-bordered w-full"
              />
            </label>
          </div>
          <div className="p-2">
            <label className="input-group">
              <span className="text-xs bg-secondary">Level Subtitle</span>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="A descriptive title"
                className="input input-bordered w-full"
              />
            </label>
          </div>
          <div className="p-2">
            <label className="input-group  h-25">
              <span className="text-xs bg-secondary">Description</span>
              <textarea
                rows={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your level"
                className="input input-bordered w-full h-25"
              />
            </label>
          </div>
          <div>
            <InputSlider
              onChange={(val: number) => setDifficulty(val)}
              value={difficulty}
              title="Course Level"
            />
          </div>
        </FormSection>
      </StandardFormBody>

      <div className="flex items-center justify-center p-2">
        {level && (
          <StandardButton
            className="bg-error border-none drop-shadow-md btn-wide text-white mx-2"
            onClick={(e: React.SyntheticEvent) => {
              e.preventDefault();
              deleteCourse(level.id, level.name);
            }}
          >
            Delete Level
          </StandardButton>
        )}
        <StandardButton
          className="bg-primary border-none drop-shadow-md btn-wide text-white hover:bg-secondary mx-2"
          onClick={(e: React.SyntheticEvent) => {
            e.preventDefault();
            onSubmitLevel();
          }}
        >
          {level ? "Update Level" : "Create Level"}
        </StandardButton>
      </div>
    </StandardForm>
  );
};

export default LevelForm;
