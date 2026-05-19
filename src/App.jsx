import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'teste-recipe-recipes'

const emptyRecipe = {
  title: '',
  description: '',
  category: '',
  tags: '',
  ingredients: '',
  instructions: '',
  prepTime: '',
  cookTime: '',
  servings: '',
  notes: '',
  rating: 0,
  image: '',
}

const starterRecipes = [
  {
    id: crypto.randomUUID(),
    title: 'Lemon Garlic Pasta',
    description: 'A bright weeknight pasta with pantry staples and fresh herbs.',
    category: 'Dinner',
    tags: ['quick', 'vegetarian', 'comfort food'],
    ingredients: 'Spaghetti\nGarlic\nLemon zest and juice\nParmesan\nParsley\nOlive oil',
    instructions:
      'Boil pasta until al dente.\nSaute garlic in olive oil.\nToss pasta with lemon, parmesan, and pasta water.\nFinish with parsley.',
    prepTime: '10',
    cookTime: '15',
    servings: '4',
    notes: 'Add chili flakes for heat.',
    rating: 5,
    image: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Weekend Pancakes',
    description: 'Fluffy pancakes for a slow breakfast.',
    category: 'Breakfast',
    tags: ['sweet', 'brunch'],
    ingredients: 'Flour\nBaking powder\nMilk\nEggs\nButter\nMaple syrup',
    instructions:
      'Whisk dry ingredients.\nFold in wet ingredients until just combined.\nCook on a buttered griddle.\nServe warm with syrup.',
    prepTime: '8',
    cookTime: '12',
    servings: '3',
    notes: 'Rest batter for five minutes before cooking.',
    rating: 4,
    image: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

function readRecipes() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return starterRecipes

  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : starterRecipes
  } catch {
    return starterRecipes
  }
}

function normalizeTags(tags) {
  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function StarRating({ value, onChange, readOnly = false }) {
  return (
    <div className="stars" aria-label={`${value || 0} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          aria-label={`Rate ${star} star${star === 1 ? '' : 's'}`}
          className={star <= Number(value) ? 'active' : ''}
          disabled={readOnly}
          key={star}
          onClick={() => onChange?.(star)}
          type="button"
        >
          ★
        </button>
      ))}
    </div>
  )
}

function RecipeForm({ categories, editingRecipe, onCancel, onSave, tagOptions }) {
  const [form, setForm] = useState(
    editingRecipe
      ? { ...editingRecipe, tags: editingRecipe.tags.join(', ') }
      : emptyRecipe,
  )
  const [error, setError] = useState('')

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => updateField('image', reader.result)
    reader.readAsDataURL(file)
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim()) {
      setError('Recipe title is required.')
      return
    }

    if (!form.ingredients.trim() || !form.instructions.trim()) {
      setError('Ingredients and instructions are required.')
      return
    }

    onSave({
      ...form,
      tags: normalizeTags(form.tags),
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim() || 'Uncategorized',
      updatedAt: new Date().toISOString(),
    })
    setForm(emptyRecipe)
    setError('')
  }

  return (
    <section className="panel form-panel" id="recipe-form">
      <div className="section-heading">
        <p className="eyebrow">{editingRecipe ? 'Update recipe' : 'Add recipe'}</p>
        <h2>{editingRecipe ? `Editing ${editingRecipe.title}` : 'Capture a favorite dish'}</h2>
      </div>

      {error ? <p className="alert">{error}</p> : null}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Title
            <input
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="Grandma's lasagna"
              value={form.title}
            />
          </label>
          <label>
            Category
            <input
              list="categories"
              onChange={(event) => updateField('category', event.target.value)}
              placeholder="Dinner"
              value={form.category}
            />
            <datalist id="categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </label>
          <label>
            Prep time (minutes)
            <input
              min="0"
              onChange={(event) => updateField('prepTime', event.target.value)}
              type="number"
              value={form.prepTime}
            />
          </label>
          <label>
            Cook time (minutes)
            <input
              min="0"
              onChange={(event) => updateField('cookTime', event.target.value)}
              type="number"
              value={form.cookTime}
            />
          </label>
          <label>
            Servings
            <input
              min="1"
              onChange={(event) => updateField('servings', event.target.value)}
              type="number"
              value={form.servings}
            />
          </label>
          <label>
            Tags
            <input
              list="tags"
              onChange={(event) => updateField('tags', event.target.value)}
              placeholder="quick, vegetarian, brunch"
              value={form.tags}
            />
            <datalist id="tags">
              {tagOptions.map((tag) => (
                <option key={tag} value={tag} />
              ))}
            </datalist>
          </label>
        </div>

        <label>
          Short description
          <input
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Why this recipe belongs in your collection"
            value={form.description}
          />
        </label>

        <div className="form-grid text-grid">
          <label>
            Ingredients
            <textarea
              onChange={(event) => updateField('ingredients', event.target.value)}
              placeholder="One ingredient per line"
              value={form.ingredients}
            />
          </label>
          <label>
            Instructions
            <textarea
              onChange={(event) => updateField('instructions', event.target.value)}
              placeholder="One step per line"
              value={form.instructions}
            />
          </label>
        </div>

        <label>
          Personal notes
          <textarea
            onChange={(event) => updateField('notes', event.target.value)}
            placeholder="Tweaks, memories, substitutions, or serving ideas"
            value={form.notes}
          />
        </label>

        <div className="form-footer">
          <label className="file-input">
            Recipe image
            <input accept="image/*" onChange={handleImageChange} type="file" />
          </label>
          <div>
            <span className="field-label">Rating</span>
            <StarRating
              onChange={(rating) => updateField('rating', rating)}
              value={form.rating}
            />
          </div>
          {form.image ? (
            <img alt="Recipe preview" className="preview" src={form.image} />
          ) : null}
        </div>

        <div className="actions">
          <button className="primary" type="submit">
            {editingRecipe ? 'Save changes' : 'Add recipe'}
          </button>
          {editingRecipe ? (
            <button onClick={onCancel} type="button">
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </section>
  )
}

function RecipeCard({ isSelected, onDelete, onEdit, onSelect, recipe }) {
  return (
    <article className={`recipe-card ${isSelected ? 'selected' : ''}`}>
      {recipe.image ? (
        <img alt="" className="recipe-image" src={recipe.image} />
      ) : (
        <div className="recipe-placeholder">🍽️</div>
      )}
      <div className="recipe-card-body">
        <div className="card-topline">
          <span>{recipe.category}</span>
          <StarRating readOnly value={recipe.rating} />
        </div>
        <h3>{recipe.title}</h3>
        <p>{recipe.description || 'No description added yet.'}</p>
        <div className="tag-list">
          {recipe.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="card-actions">
          <button onClick={() => onSelect(recipe)} type="button">
            View
          </button>
          <button onClick={() => onEdit(recipe)} type="button">
            Edit
          </button>
          <button className="danger" onClick={() => onDelete(recipe.id)} type="button">
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}

function RecipeDetail({ recipe }) {
  if (!recipe) {
    return (
      <section className="panel detail-panel empty-detail">
        <p className="eyebrow">Recipe details</p>
        <h2>Select a recipe to see the full card</h2>
        <p>Ingredients, instructions, notes, timing, and ratings appear here.</p>
      </section>
    )
  }

  const ingredients = recipe.ingredients.split('\n').filter(Boolean)
  const instructions = recipe.instructions.split('\n').filter(Boolean)

  return (
    <section className="panel detail-panel">
      <div className="detail-hero">
        {recipe.image ? (
          <img alt="" className="detail-image" src={recipe.image} />
        ) : (
          <div className="detail-placeholder">🍳</div>
        )}
        <div>
          <p className="eyebrow">{recipe.category}</p>
          <h2>{recipe.title}</h2>
          <p>{recipe.description}</p>
          <StarRating readOnly value={recipe.rating} />
        </div>
      </div>

      <div className="stats">
        <span>Prep: {recipe.prepTime || 0} min</span>
        <span>Cook: {recipe.cookTime || 0} min</span>
        <span>Serves: {recipe.servings || 'N/A'}</span>
      </div>

      <div className="detail-grid">
        <div>
          <h3>Ingredients</h3>
          <ul>
            {ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Instructions</h3>
          <ol>
            {instructions.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      {recipe.notes ? (
        <div className="notes">
          <h3>Personal notes</h3>
          <p>{recipe.notes}</p>
        </div>
      ) : null}
    </section>
  )
}

function App() {
  const [recipes, setRecipes] = useState(readRecipes)
  const [selectedId, setSelectedId] = useState(recipes[0]?.id ?? '')
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [tagFilter, setTagFilter] = useState('All')
  const [ratingFilter, setRatingFilter] = useState('All')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))
  }, [recipes])

  const categories = useMemo(
    () => [...new Set(recipes.map((recipe) => recipe.category).filter(Boolean))].sort(),
    [recipes],
  )

  const tags = useMemo(
    () => [...new Set(recipes.flatMap((recipe) => recipe.tags))].sort(),
    [recipes],
  )

  const filteredRecipes = useMemo(() => {
    const search = query.trim().toLowerCase()

    return recipes.filter((recipe) => {
      const matchesSearch =
        !search ||
        [recipe.title, recipe.description, recipe.ingredients, recipe.instructions]
          .join(' ')
          .toLowerCase()
          .includes(search)
      const matchesCategory =
        categoryFilter === 'All' || recipe.category === categoryFilter
      const matchesTag = tagFilter === 'All' || recipe.tags.includes(tagFilter)
      const matchesRating =
        ratingFilter === 'All' || Number(recipe.rating) >= Number(ratingFilter)

      return matchesSearch && matchesCategory && matchesTag && matchesRating
    })
  }, [categoryFilter, query, ratingFilter, recipes, tagFilter])

  const selectedRecipe =
    recipes.find((recipe) => recipe.id === selectedId) ?? filteredRecipes[0] ?? null

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2600)
  }

  function saveRecipe(recipe) {
    if (recipe.id) {
      setRecipes((current) =>
        current.map((item) => (item.id === recipe.id ? recipe : item)),
      )
      setSelectedId(recipe.id)
      showNotice('Recipe updated.')
    } else {
      const newRecipe = {
        ...recipe,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      setRecipes((current) => [newRecipe, ...current])
      setSelectedId(newRecipe.id)
      showNotice('Recipe added.')
    }
    setEditingRecipe(null)
  }

  function deleteRecipe(id) {
    const recipe = recipes.find((item) => item.id === id)
    if (!recipe || !confirm(`Delete "${recipe.title}"?`)) return

    setRecipes((current) => current.filter((item) => item.id !== id))
    if (selectedId === id) setSelectedId('')
    showNotice('Recipe deleted.')
  }

  function resetFilters() {
    setQuery('')
    setCategoryFilter('All')
    setTagFilter('All')
    setRatingFilter('All')
  }

  return (
    <main>
      <header className="app-header">
        <div>
          <p className="eyebrow">Teste Recipe</p>
          <h1>Your personal recipe vault</h1>
          <p>
            Store recipes, organize them with categories and tags, rate favorites,
            and search your collection from one cozy kitchen dashboard.
          </p>
        </div>
        <a className="skip-link" href="#recipe-form">
          Add a recipe
        </a>
      </header>

      {notice ? <p className="toast">{notice}</p> : null}

      <section className="panel controls">
        <label>
          Search recipes
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles, ingredients, or instructions"
            value={query}
          />
        </label>
        <label>
          Category
          <select
            onChange={(event) => setCategoryFilter(event.target.value)}
            value={categoryFilter}
          >
            <option>All</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label>
          Tag
          <select onChange={(event) => setTagFilter(event.target.value)} value={tagFilter}>
            <option>All</option>
            {tags.map((tag) => (
              <option key={tag}>{tag}</option>
            ))}
          </select>
        </label>
        <label>
          Minimum rating
          <select
            onChange={(event) => setRatingFilter(event.target.value)}
            value={ratingFilter}
          >
            <option>All</option>
            <option value="5">5 stars</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
            <option value="2">2+ stars</option>
            <option value="1">1+ star</option>
          </select>
        </label>
        <button onClick={resetFilters} type="button">
          Clear filters
        </button>
      </section>

      <div className="content-grid">
        <section className="recipe-list" aria-live="polite">
          <div className="section-heading">
            <p className="eyebrow">{filteredRecipes.length} recipes found</p>
            <h2>Recipe collection</h2>
          </div>

          {filteredRecipes.length ? (
            filteredRecipes.map((recipe) => (
              <RecipeCard
                isSelected={selectedRecipe?.id === recipe.id}
                key={recipe.id}
                onDelete={deleteRecipe}
                onEdit={setEditingRecipe}
                onSelect={(selected) => setSelectedId(selected.id)}
                recipe={recipe}
              />
            ))
          ) : (
            <div className="panel empty-state">
              <h3>No recipes match your filters</h3>
              <p>Try clearing filters or add a new recipe to your collection.</p>
            </div>
          )}
        </section>

        <div className="side-column">
          <RecipeDetail recipe={selectedRecipe} />
          <RecipeForm
            categories={categories}
            editingRecipe={editingRecipe}
            key={editingRecipe?.id ?? 'new-recipe'}
            onCancel={() => setEditingRecipe(null)}
            onSave={saveRecipe}
            tagOptions={tags}
          />
        </div>
      </div>
    </main>
  )
}

export default App
