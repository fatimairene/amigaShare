"use client";

import { useState } from "react";
import styles from "./colours.module.css";

interface PersonWithColor {
  id: string;
  name: string;
  color: string;
}

interface ManualColor {
  id: string;
  color: string;
}

const AVAILABLE_COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#FFA07A", // Light Salmon
  "#98D8C8", // Mint
  "#F7DC6F", // Yellow
  "#BB8FCE", // Purple
  "#85C1E2", // Sky Blue
  "#F8B88B", // Peach
  "#A9DFBF", // Light Green
  "#F1948A", // Pink
  "#AED6F1", // Light Blue
];

function getRandomColor(usedColors: string[]): string {
  const availableColors = AVAILABLE_COLORS.filter(
    (color) => !usedColors.includes(color)
  );
  if (availableColors.length === 0) {
    return AVAILABLE_COLORS[
      Math.floor(Math.random() * AVAILABLE_COLORS.length)
    ];
  }
  return availableColors[Math.floor(Math.random() * availableColors.length)];
}

function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

export default function ColoursPage() {
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [suggestedPeople, setSuggestedPeople] = useState<PersonWithColor[]>([]);
  const [manualColors, setManualColors] = useState<ManualColor[]>([]);
  const [assignedPeople, setAssignedPeople] = useState<PersonWithColor[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [colorInput, setColorInput] = useState("#FF6B6B");
  const [validationError, setValidationError] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const addPerson = () => {
    if (inputValue.trim() === "") return;

    // Validar nombres duplicados en modo manual
    if (mode === "manual") {
      const hasDuplicate = suggestedPeople.some(
        (p) => p.name.toLowerCase() === inputValue.trim().toLowerCase()
      );
      if (hasDuplicate) {
        setValidationError("Person name already exists!");
        return;
      }
    }

    const usedColors = suggestedPeople.map((p) => p.color);
    const newColor = getRandomColor(usedColors);

    const newPerson: PersonWithColor = {
      id: Date.now().toString(),
      name: inputValue.trim(),
      color: newColor,
    };

    setSuggestedPeople([...suggestedPeople, newPerson]);
    setInputValue("");
    setValidationError("");
  };

  const addManualColor = () => {
    if (!colorInput.trim()) return;

    const upperColor = colorInput.trim().toUpperCase();

    // Validar si es un color válido (hex o rgb)
    if (!isValidHexColor(upperColor)) {
      setValidationError("Invalid color format. Use #RRGGBB");
      return;
    }

    // Validar colores duplicados
    if (manualColors.some((c) => c.color === upperColor)) {
      setValidationError("This color already exists!");
      return;
    }

    const newColor: ManualColor = {
      id: Date.now().toString(),
      color: upperColor,
    };

    setManualColors([...manualColors, newColor]);
    setColorInput("#FF6B6B");
    setValidationError("");
    setShowColorPicker(false);
  };

  const removePerson = (id: string) => {
    setSuggestedPeople(suggestedPeople.filter((p) => p.id !== id));
  };

  const removeManualColor = (id: string) => {
    setManualColors(manualColors.filter((c) => c.id !== id));
  };

  const changeColor = (id: string) => {
    setSuggestedPeople((prevPeople) => {
      const updatedPeople = prevPeople.map((person) => {
        if (person.id === id) {
          const usedColors = prevPeople
            .filter((p) => p.id !== id)
            .map((p) => p.color);
          const newColor = getRandomColor(usedColors);
          return { ...person, color: newColor };
        }
        return person;
      });
      return updatedPeople;
    });
  };

  const canAssign = (): boolean => {
    if (mode === "auto") return true;
    // En modo manual: igual número de personas y colores
    return suggestedPeople.length === manualColors.length;
  };

  const assignRandomly = () => {
    if (!canAssign()) return;

    let assigned: PersonWithColor[];

    if (mode === "auto") {
      assigned = [...suggestedPeople];
    } else {
      // Modo manual: asignar colores a personas
      const shuffledColors = [...manualColors].sort(() => Math.random() - 0.5);
      assigned = suggestedPeople.map((person, index) => ({
        ...person,
        color: shuffledColors[index].color,
      }));
    }

    setAssignedPeople(assigned);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addPerson();
    }
  };

  const handleColorKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addManualColor();
    }
  };

  return (
    <div className={styles.container}>
      <h1>Color Assigner</h1>

      <div className={styles.modeSelector}>
        <button
          className={`${styles.modeButton} ${
            mode === "auto" ? styles.active : ""
          }`}
          onClick={() => {
            setMode("auto");
            setManualColors([]);
            setAssignedPeople([]);
            setValidationError("");
          }}
        >
          Auto Mode
        </button>
        <button
          className={`${styles.modeButton} ${
            mode === "manual" ? styles.active : ""
          }`}
          onClick={() => {
            setMode("manual");
            setAssignedPeople([]);
            setValidationError("");
          }}
        >
          Manual Mode
        </button>
      </div>

      {validationError && (
        <div className={styles.errorMessage}>{validationError}</div>
      )}

      <div className={styles.mainContent}>
        {/* Left side - People input and list */}
        <div className={styles.leftSection}>
          <h2>Add People</h2>

          <div className={styles.inputSection}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter person name..."
              className={styles.input}
            />
            <button onClick={addPerson} className={styles.addButton}>
              Add
            </button>
          </div>

          {suggestedPeople.length > 0 && (
            <div className={styles.peopleList}>
              {suggestedPeople.map((person) => (
                <div key={person.id} className={styles.personItem}>
                  <span className={styles.personName}>{person.name}</span>
                  <button
                    onClick={() => removePerson(person.id)}
                    className={styles.removeButton}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {suggestedPeople.length === 0 && (
            <p className={styles.emptyMessage}>Add people to get started!</p>
          )}
        </div>

        {/* Right side - Color assignment */}
        <div className={styles.rightSection}>
          <h2>{mode === "auto" ? "Suggested Colors" : "Manual Colors"}</h2>

          {mode === "auto" ? (
            <>
              {suggestedPeople.length > 0 ? (
                <div className={styles.colorGridWithActions}>
                  {suggestedPeople.map((person) => (
                    <div key={person.id} className={styles.colorBoxContainer}>
                      <div
                        className={styles.colorBox}
                        style={{ backgroundColor: person.color }}
                        title={person.name}
                      ></div>
                      <button
                        onClick={() => changeColor(person.id)}
                        className={styles.changeColorButton}
                        title="Change this color"
                        disabled={assignedPeople.length > 0}
                      >
                        ↻
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyMessage}>
                  Suggested colors will appear here
                </p>
              )}
            </>
          ) : (
            <>
              <div className={styles.colorPickerSection}>
                <div className={styles.colorInputContainer}>
                  <input
                    type="color"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    className={styles.colorPickerInput}
                    title="Click to pick a color"
                  />
                  <span className={styles.colorCode}>
                    {colorInput.toUpperCase()}
                  </span>
                </div>
                <button onClick={addManualColor} className={styles.addButton}>
                  Add Color
                </button>
              </div>

              <div className={styles.paletteSection}>
                <p className={styles.paletteLabel}>Or choose from palette:</p>
                <div className={styles.colorPalette}>
                  {AVAILABLE_COLORS.map((color) => (
                    <button
                      key={color}
                      className={styles.paletteColor}
                      style={{ backgroundColor: color }}
                      onClick={() => setColorInput(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {manualColors.length > 0 ? (
                <div className={styles.colorGridWithDelete}>
                  {manualColors.map((color) => (
                    <div key={color.id} className={styles.colorBoxContainer}>
                      <div
                        className={styles.colorBox}
                        style={{ backgroundColor: color.color }}
                      ></div>
                      <button
                        onClick={() => removeManualColor(color.id)}
                        className={styles.removeColorButton}
                        disabled={assignedPeople.length > 0}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyMessage}>Add colors manually here</p>
              )}
            </>
          )}
        </div>
      </div>

      {suggestedPeople.length > 0 && (
        <>
          {!canAssign() && mode === "manual" && (
            <div className={styles.warningMessage}>
              ⚠️ Number of people ({suggestedPeople.length}) must equal number
              of colors ({manualColors.length}) to assign!
            </div>
          )}
          <button
            onClick={assignRandomly}
            className={styles.assignButton}
            disabled={!canAssign()}
          >
            Assign Randomly
          </button>
        </>
      )}

      {assignedPeople.length > 0 && (
        <div className={styles.assignedSection}>
          <h2>Final Assignment</h2>
          <div className={styles.colorAssignmentList}>
            {assignedPeople.map((person) => (
              <div key={person.id} className={styles.assignmentCard}>
                <div
                  className={styles.colorBoxWithLabel}
                  style={{ backgroundColor: person.color }}
                ></div>
                <span className={styles.assignmentName}>{person.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
