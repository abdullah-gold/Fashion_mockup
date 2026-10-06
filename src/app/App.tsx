import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router"
import {
  Search,
  UserRound,
  ShoppingBag,
  ArrowRight,
  ArrowUpRight,
  Heart,
  X,
  Menu,
  Plus,
  Minus,
  Check,
  LockKeyhole,
  SlidersHorizontal,
  ArrowLeft,
  Package,
  Truck,
  ShieldCheck,
} from "lucide-react"

const photo = (id: string, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`
const images = [
  photo("photo-1618333452884-5c8d211ed2ad"),
  photo("photo-1548207775-a7676e36f20a"),
  photo("photo-1623193904310-9d38ce94670b"),
  photo("photo-1618244965061-1d27b208d6e8"),
  photo("photo-1636394431798-ae871f8011f2"),
  photo("photo-1618333453296-9e35280fd6b1"),
]
const products = [
  {
    id: "01",
    name: "The Sculpted Trench",
    category: "Outerwear",
    price: 485,
    color: "Stone",
    image: images[0],
    tag: "NEW ARRIVAL",
  },
  {
    id: "02",
    name: "The Élan Silk Dress",
    category: "Dresses",
    price: 325,
    color: "Ivory",
    image: images[1],
    tag: "THE SIGNATURE EDIT",
  },
  {
    id: "03",
    name: "The Essential Blouse",
    category: "Tops",
    price: 195,
    color: "Noir",
    image: images[2],
    tag: "BESTSELLER",
  },
  {
    id: "04",
    name: "The Atelier Wool Coat",
    category: "Outerwear",
    price: 595,
    color: "Taupe",
    image: images[3],
    tag: "NEW ARRIVAL",
  },
  {
    id: "05",
    name: "The Fluid Wide-Leg Trouser",
    category: "Bottoms",
    price: 245,
    color: "Stone",
    image: images[4],
    tag: "THE SIGNATURE EDIT",
  },
  {
    id: "06",
    name: "The Everyday Leather Tote",
    category: "Accessories",
    price: 345,
    color: "Noir",
    image: images[5],
    tag: "BESTSELLER",
  },
]
type Product = typeof products[number]
type BagItem = {
  id: string
  size: string
  color: string
  qty: number
}
type Store = {
  bag: BagItem[]
  setBag: React.Dispatch<React.SetStateAction<BagItem[]>>
  wishlist: string[]
  toggleWish: (id: string) => void
  add: (product: Product, size: string, color: string, qty?: number) => void
  notify: (text: string) => void
  quick: (product: Product) => void
}
const StoreContext = createContext<Store>(null!)
const useStore = () => useContext(StoreContext)
const label = "text-[10px] font-medium uppercase tracking-[0.18em]"
const money = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price)
function Button({
  children,
  onClick,
  light = false,
  type = "button",
  className = "",
}: {
  children: ReactNode
  onClick?: () => void
  light?: boolean
  type?: "button" | "submit"
  className?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${label} min-h-12 border px-7 transition-colors duration-300 ${
        light
          ? "border-neutral-400 bg-transparent hover:bg-neutral-100"
          : "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-700"
      } ${className}`}
    >
      {children}
    </button>
  )
}
function TextLink({ to, children }: {
  to: string
  children: ReactNode
}) {
  return (
    <Link
      to={to}
      className={`${label} inline-flex items-center gap-7 border-b border-neutral-600 pb-2 transition-opacity hover:opacity-50`}
    >
      {children}
      <ArrowRight size={14} strokeWidth={1.2} />
    </Link>
  )
}
function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWish, quick } = useStore()
  return (
    <article className="group min-w-0">
      <div className="relative overflow-hidden bg-[#eeece8]">
        <Link to={`/product/${product.id}`}>
          <img
            loading="lazy"
            src={product.image}
            alt={product.name}
            className="aspect-[3/4] w-full object-cover grayscale-[35%] transition-transform duration-700 group-hover:scale-[1.035]"
          />
        </Link>
        <button
          aria-label={`Save ${product.name}`}
          onClick={() => toggleWish(product.id)}
          className="absolute right-3 top-3 bg-white/85 p-2.5"
        >
          <Heart
            size={16}
            strokeWidth={1.2}
            fill={wishlist.includes(product.id) ? "currentColor" : "none"}
          />
        </button>
        <button
          onClick={() => quick(product)}
          className={`${label} absolute inset-x-0 bottom-0 bg-white/95 py-4 opacity-100 transition-opacity sm:opacity-0 group-hover:opacity-100 focus:opacity-100`}
        >
          Quick view <Plus className="ml-2 inline" size={12} />
        </button>
      </div>
      <div className="pt-4">
        <p className="mb-2 text-[8px] tracking-[0.15em] text-neutral-500">
          {product.tag}
        </p>
        <div className="flex justify-between gap-2 text-[12px]">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
          <span>{money(product.price)}</span>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[10px] text-neutral-500">
          <span
            className={`h-2 w-2 rounded-full border border-neutral-300 ${
              product.color === "Noir" ? "bg-neutral-800" : "bg-[#d6d0c4]"
            }`}
          />
          {product.color}{" "}
          <span className="ml-1 text-neutral-400">+2 colours</span>
        </p>
      </div>
    </article>
  )
}
function ProductGrid({ items = products.slice(0, 4) }: { items?: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
function Shell() {
  const read = <T,>(key: string, fallback: T): T => {
    try {
      return JSON.parse(localStorage.getItem(key) || "null") || fallback
    } catch {
      return fallback
    }
  }
  const [bag, setBag] = useState<BagItem[]>(() => read("azya-bag", []))
  const [wishlist, setWishlist] = useState<string[]>(() =>
    read("azya-wishlist", []),
  )
  const [toast, setToast] = useState("")
  const [quickProduct, setQuickProduct] = useState<Product | null>(null)
  const [mobile, setMobile] = useState(false)
  const location = useLocation()
  useEffect(() => {
    localStorage.setItem("azya-bag", JSON.stringify(bag))
  }, [bag])
  useEffect(() => {
    localStorage.setItem("azya-wishlist", JSON.stringify(wishlist))
  }, [wishlist])
  useEffect(() => {
    window.scrollTo(0, 0)
    setMobile(false)
  }, [location.pathname])
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3500)
      return () => clearTimeout(timer)
    }
  }, [toast])
  const store: Store = {
    bag,
    setBag,
    wishlist,
    toggleWish: (id) =>
      setWishlist((previous) =>
        previous.includes(id)
          ? previous.filter((item) => item !== id)
          : [...previous, id],
      ),
    notify: setToast,
    quick: setQuickProduct,
    add: (product, size, color, qty = 1) => {
      setBag((previous) => {
        const existing = previous.find(
          (item) =>
            item.id === product.id &&
            item.size === size &&
            item.color === color,
        )
        return existing
          ? previous.map((item) =>
              item === existing ? { ...item, qty: item.qty + qty } : item,
            )
          : [...previous, { id: product.id, size, color, qty }]
      })
      setToast(`${product.name} added to your bag`)
    },
  }
  return (
    <StoreContext.Provider value={store}>
      <div className="min-h-screen">
        <div className="flex h-8 items-center justify-center bg-[#f2f2f0] text-[8px] tracking-[0.16em] sm:text-[9px]">
          COMPLIMENTARY SHIPPING ON ORDERS OVER $250{" "}
          <span className="mx-5 hidden text-neutral-400 sm:inline">—</span>
          <span className="hidden sm:inline">
            THOUGHTFULLY MADE. FOREVER WORN.
          </span>
        </div>
        <header className="relative z-20 border-b border-border bg-white">
          <div className="relative mx-auto flex h-[88px] max-w-[1600px] items-center justify-between px-6 lg:px-14">
            <nav className={`${label} hidden gap-7 lg:flex`}>
              <Link
                className="hover:opacity-50"
                to="/collection?category=New%20Arrivals"
              >
                New arrivals
              </Link>
              <Link className="hover:opacity-50" to="/collection">
                Collections
              </Link>
              <Link className="hover:opacity-50" to="/about">
                The house
              </Link>
            </nav>
            <button
              aria-label="Open navigation"
              className="lg:hidden"
              onClick={() => setMobile(!mobile)}
            >
              <Menu size={21} strokeWidth={1.2} />
            </button>
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 font-serif text-[43px] tracking-[0.16em]"
            >
              AZYA
            </Link>
            <div className="flex items-center gap-5 sm:gap-7">
              <Link aria-label="Search" to="/search">
                <Search size={19} strokeWidth={1.2} />
              </Link>
              <Link
                aria-label="Account"
                className="hidden sm:block"
                to="/account"
              >
                <UserRound size={19} strokeWidth={1.2} />
              </Link>
              <Link
                aria-label="Wishlist"
                className="hidden sm:block"
                to="/account?tab=Wishlist"
              >
                <Heart size={19} strokeWidth={1.2} />
              </Link>
              <Link
                aria-label="Shopping bag"
                to="/bag"
                className="flex items-center gap-2"
              >
                <ShoppingBag size={19} strokeWidth={1.2} />
                <span className="text-[10px]">
                  ({bag.reduce((sum, item) => sum + item.qty, 0)})
                </span>
              </Link>
            </div>
          </div>
          {mobile && (
            <nav className="absolute inset-x-0 top-full flex flex-col gap-6 border-b bg-white p-8 text-sm">
              <Link to="/collection">Collections</Link>
              <Link to="/collection?category=New%20Arrivals">New arrivals</Link>
              <Link to="/about">The house of AZYA</Link>
              <Link to="/account">My account</Link>
            </nav>
          )}
        </header>
        <main>
          <Outlet />
        </main>
        <Footer />
        {toast && (
          <div
            role="status"
            className="fixed bottom-6 right-6 z-50 flex max-w-[90vw] items-center gap-4 border bg-white px-6 py-5 text-xs shadow-lg"
          >
            <Check size={17} />
            {toast}
            <button
              aria-label="Dismiss notification"
              onClick={() => setToast("")}
            >
              <X size={15} />
            </button>
          </div>
        )}
        {quickProduct && (
          <Modal close={() => setQuickProduct(null)} title="Quick view">
            <div className="grid gap-8 sm:grid-cols-2">
              <img
                className="aspect-[3/4] w-full object-cover"
                src={quickProduct.image}
                alt={quickProduct.name}
              />
              <ProductInfo
                product={quickProduct}
                afterAdd={() => setQuickProduct(null)}
              />
            </div>
          </Modal>
        )}
      </div>
    </StoreContext.Provider>
  )
}
function Home() {
  return (
    <>
      <section className="relative min-h-[570px] overflow-hidden bg-[#deddd9] md:h-[620px] xl:h-[660px]">
        <img
          src={images[0]}
          alt="The AZYA collection — sculptural tailoring in stone"
          className="absolute inset-y-0 right-0 h-full w-full object-cover object-[50%_37%] grayscale md:w-[62%] md:object-[50%_40%]"
        />
        <div className="absolute inset-0 bg-black/25 md:hidden" />
        <div className="relative flex min-h-[570px] max-w-[1600px] flex-col justify-center px-7 py-20 text-white md:h-full md:w-[58%] md:bg-[#deddd9] md:pr-12 md:text-neutral-800 lg:px-14">
          <p className={`${label} mb-8`}>THE NEW SEASON · COLLECTION 2026</p>
          <h1 className="font-serif text-[57px] leading-[0.97] sm:text-[75px] lg:text-[88px]">
            The art of
            <br />
            feminine
            <br />
            <span className="italic">elegance.</span>
          </h1>
          <p className="mt-7 max-w-72 text-[12px] leading-6 md:text-neutral-600">
            Refined silhouettes. Quiet confidence.
            <br />
            An expression of who you are.
          </p>
          <Link
            to="/collection"
            className={`${label} mt-9 flex w-fit items-center gap-10 bg-neutral-900 px-7 py-5 text-white transition-colors hover:bg-neutral-700`}
          >
            Explore the collection <ArrowRight size={15} strokeWidth={1.2} />
          </Link>
        </div>
        <div className="absolute bottom-7 right-8 flex items-center gap-5 text-[9px] text-white">
          <span>01</span>
          <span className="h-px w-20 bg-white/70" />
          <span className="opacity-60">03</span>
        </div>
        <p className="absolute right-7 top-8 hidden text-[9px] tracking-[0.18em] text-white md:block">
          THE AZYA SIGNATURE
        </p>
      </section>
      <div className="grid grid-cols-1 border-b border-border px-6 py-6 text-center sm:grid-cols-3">
        <p className={`${label} flex items-center justify-center gap-3`}>
          <Truck size={15} strokeWidth={1} />
          Complimentary shipping
        </p>
        <p
          className={`${label} hidden items-center justify-center gap-3 border-x border-border sm:flex`}
        >
          <Package size={15} strokeWidth={1} />
          Considered craftsmanship
        </p>
        <p
          className={`${label} hidden items-center justify-center gap-3 sm:flex`}
        >
          <ShieldCheck size={15} strokeWidth={1} />
          Effortless returns
        </p>
      </div>
      <section className="mx-auto max-w-[1600px] px-6 py-16 lg:px-14 lg:py-20">
        <div className="mb-9 flex items-end justify-between">
          <div>
            <p className={`${label} mb-3 text-neutral-500`}>
              A NEW PERSPECTIVE
            </p>
            <h2 className="font-serif text-4xl md:text-[44px]">
              The latest expressions
            </h2>
          </div>
          <div className="hidden sm:block">
            <TextLink to="/collection?category=New%20Arrivals">
              Discover new arrivals
            </TextLink>
          </div>
        </div>
        <ProductGrid />
        <div className="mt-9 sm:hidden">
          <TextLink to="/collection">Discover all pieces</TextLink>
        </div>
      </section>
      <section className="grid bg-[#f3f2ef] md:grid-cols-2">
        <div className="relative">
          <img
            loading="lazy"
            src={images[1]}
            alt="AZYA portrait, an exploration of timeless femininity"
            className="h-[470px] w-full object-cover object-[50%_30%] grayscale md:h-[650px]"
          />
          <span className={`${label} absolute bottom-7 left-7 text-white`}>
            THE SIGNATURE COLLECTION
          </span>
        </div>
        <div className="flex flex-col justify-center px-8 py-20 md:px-16 lg:px-24">
          <p className={`${label} mb-7 text-neutral-500`}>
            LESS, BUT EXTRAORDINARY
          </p>
          <h2 className="font-serif text-5xl leading-[1.08] lg:text-6xl">
            Beyond trends.
            <br />
            <span className="italic">Beyond seasons.</span>
          </h2>
          <p className="my-8 max-w-sm text-[13px] leading-7 text-neutral-500">
            Pieces that become part of you. Discover a collection of enduring
            essentials, defined by exceptional fabrics and an uncompromising
            attention to detail.
          </p>
          <div>
            <TextLink to="/collection">The signature edit</TextLink>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1600px] px-6 py-20 lg:px-14">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className={`${label} mb-3 text-neutral-500`}>
              LOVED, WORN, REPEATED
            </p>
            <h2 className="font-serif text-[44px]">The most coveted</h2>
          </div>
          <TextLink to="/collection?sort=popular">View all</TextLink>
        </div>
        <ProductGrid
          items={[products[2], products[3], products[4], products[5]]}
        />
      </section>
      <section className="relative flex min-h-[540px] items-end overflow-hidden px-7 py-14 md:px-16">
        <img
          src={images[4]}
          alt="AZYA journal — a study in quiet confidence"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative text-white">
          <p className={`${label} mb-5`}>THE AZYA JOURNAL · ISSUE 01</p>
          <h2 className="mb-8 font-serif text-5xl md:text-7xl">
            A study in quiet confidence.
          </h2>
          <TextLink to="/about">Read the story</TextLink>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-8 py-24 text-center">
        <p className={`${label} mb-7 text-neutral-500`}>THE HOUSE OF AZYA</p>
        <h2 className="font-serif text-4xl leading-tight md:text-5xl">
          Not simply what you wear.
          <br />
          <span className="italic">How you move through the world.</span>
        </h2>
        <p className="mx-auto mb-8 mt-7 max-w-lg text-xs leading-7 text-neutral-500">
          A modern expression of femininity. Rooted in thoughtful design,
          exceptional craftsmanship and the belief that true elegance is always
          effortless.
        </p>
        <TextLink to="/about">Our world</TextLink>
      </section>
    </>
  )
}
function Collection() {
  const [params, setParams] = useSearchParams()
  const category = params.get("category") || "All pieces"
  const [sort, setSort] = useState(params.get("sort") || "featured")
  const [filters, setFilters] = useState(false)
  const [max, setMax] = useState(600)
  let items = products.filter(
    (product) =>
      (category === "All pieces" ||
        (category === "New Arrivals" && product.tag === "NEW ARRIVAL") ||
        product.category === category) &&
      product.price <= max,
  )
  if (sort === "low")
    items = [...items].sort((first, second) => first.price - second.price)
  if (sort === "high")
    items = [...items].sort((first, second) => second.price - first.price)
  if (sort === "popular")
    items = [...items].sort((first) => (first.tag === "BESTSELLER" ? -1 : 1))
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-12 lg:px-14">
      <p className="mb-9 text-[10px] text-neutral-500">
        <Link to="/">Home</Link> / Collections
      </p>
      <div className="mb-12 text-center">
        <p className={`${label} mb-4 text-neutral-500`}>THE AZYA WARDROBE</p>
        <h1 className="font-serif text-6xl">
          {category === "All pieces"
            ? "Considered. Collected. Cherished."
            : category}
        </h1>
        <p className="mt-5 text-xs text-neutral-500">
          Timeless silhouettes for a life beautifully lived.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-5 border-y border-border py-5">
        <div className="flex flex-wrap gap-5">
          {[
            "All pieces",
            "New Arrivals",
            "Dresses",
            "Tops",
            "Outerwear",
            "Bottoms",
            "Accessories",
          ].map((name) => (
            <button
              key={name}
              onClick={() =>
                setParams(name === "All pieces" ? {} : { category: name })
              }
              className={`${label} ${
                category === name
                  ? "underline underline-offset-8"
                  : "text-neutral-500"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-5">
          <button
            onClick={() => setFilters(!filters)}
            className={`${label} flex items-center gap-2`}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
          <select
            aria-label="Sort collection"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className={`${label} bg-transparent`}
          >
            <option value="featured">Featured</option>
            <option value="popular">Best sellers</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>
      </div>
      {filters && (
        <div className="flex items-center gap-5 border-b py-6 text-xs">
          <label htmlFor="price">Maximum price: {money(max)}</label>
          <input
            id="price"
            type="range"
            min="195"
            max="600"
            value={max}
            onChange={(event) => setMax(Number(event.target.value))}
            className="accent-neutral-800"
          />
          <button onClick={() => setMax(600)} className="underline">
            Reset
          </button>
        </div>
      )}
      <p className="py-6 text-[10px] text-neutral-500">
        {items.length} considered pieces
      </p>
      {items.length ? (
        <ProductGrid items={items} />
      ) : (
        <Empty
          title="Nothing here, just yet."
          description="Try a different category or adjust your filters."
        />
      )}
      <div className="mt-16 flex justify-center">
        <span className="border px-4 py-2 text-xs">1</span>
      </div>
    </section>
  )
}
function Modal({
  children,
  close,
  title,
}: {
  children: ReactNode
  close: () => void
  title: string
}) {
  const dialog = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const previous = document.body.style.overflow
    const previousFocus = document.activeElement as HTMLElement | null
    document.body.style.overflow = "hidden"
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
      if (event.key === "Tab") {
        const controls = dialog.current?.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex="0"]')
        if (!controls?.length) return
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", handler)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener("keydown", handler)
      previousFocus?.focus()
    }
  }, [close])
  return (
    <div
      onClick={close}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div
        role="dialog"
        ref={dialog}
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-4xl overflow-auto bg-white p-7 md:p-10"
      >
        <button
          autoFocus
          aria-label="Close dialog"
          onClick={close}
          className="absolute right-4 top-4 z-10 bg-white p-2"
        >
          <X size={20} strokeWidth={1.2} />
        </button>
        {children}
      </div>
    </div>
  )
}
function ProductInfo({
  product,
  afterAdd,
}: {
  product: Product
  afterAdd?: () => void
}) {
  const [size, setSize] = useState("")
  const [color, setColor] = useState(product.color)
  const [qty, setQty] = useState(1)
  const [guide, setGuide] = useState(false)
  const [error, setError] = useState("")
  const store = useStore()
  return (
    <div className="py-4">
      <p className={`${label} mb-5 text-neutral-500`}>{product.tag}</p>
      <h1 className="font-serif text-4xl md:text-5xl">{product.name}</h1>
      <p className="mt-4 text-sm">
        {money(product.price)}{" "}
        <span className="ml-3 text-[10px] text-neutral-500">
          Taxes included
        </span>
      </p>
      <p className="my-7 text-xs leading-7 text-neutral-500">
        A study in effortless elegance. Thoughtfully tailored with a fluid
        silhouette and exquisite finishing, made to move beautifully with you,
        season after season.
      </p>
      <p className={`${label} mb-3`}>Colour — {color}</p>
      <div className="mb-6 flex gap-3">
        {[
          product.color,
          ...["Ivory", "Noir", "Stone"].filter(
            (item) => item !== product.color,
          ),
        ]
          .slice(0, 3)
          .map((value) => (
            <button
              key={value}
              aria-label={value}
              onClick={() => setColor(value)}
              className={`h-7 w-7 rounded-full border-4 ring-1 ${
                value === "Noir"
                  ? "bg-neutral-800"
                  : value === "Ivory"
                    ? "bg-[#eeede7]"
                    : "bg-[#bdb6aa]"
              } ${
                color === value
                  ? "border-white ring-neutral-900"
                  : "border-transparent ring-neutral-200"
              }`}
            />
          ))}
      </div>
      <div className="mb-3 flex justify-between">
        <span className={label}>Select size</span>
        <button
          onClick={() => setGuide(true)}
          className="text-[10px] underline underline-offset-4"
        >
          Size guide
        </button>
      </div>
      <div className="flex gap-2">
        {["XS", "S", "M", "L", "XL"].map((value) => (
          <button
            key={value}
            onClick={() => {
              setSize(value)
              setError("")
            }}
            className={`h-11 flex-1 border text-xs ${
              size === value
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-border hover:border-neutral-800"
            }`}
          >
            {value}
          </button>
        ))}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-xs text-red-700">
          {error}
        </p>
      )}
      <div className="my-6 flex gap-3">
        <div className="flex items-center border border-border">
          <button
            aria-label="Decrease quantity"
            className="p-3"
            onClick={() => setQty(Math.max(1, qty - 1))}
          >
            <Minus size={13} />
          </button>
          <span className="text-xs">{qty}</span>
          <button
            aria-label="Increase quantity"
            className="p-3"
            onClick={() => setQty(qty + 1)}
          >
            <Plus size={13} />
          </button>
        </div>
        <Button
          className="flex-1"
          onClick={() => {
            if (!size) return setError("Please select your size.")
            store.add(product, size, color, qty)
            afterAdd?.()
          }}
        >
          Add to bag
        </Button>
        <button
          aria-label="Add to wishlist"
          className="border border-border px-4"
          onClick={() => store.toggleWish(product.id)}
        >
          <Heart
            size={17}
            fill={store.wishlist.includes(product.id) ? "currentColor" : "none"}
            strokeWidth={1.2}
          />
        </button>
      </div>
      <p className="mb-7 flex items-center gap-2 text-[10px] text-neutral-500">
        <Truck size={15} />
        Complimentary delivery & 30-day returns
      </p>
      {[
        "Details & craftsmanship",
        "Delivery & returns",
        "Care instructions",
      ].map((title, index) => (
        <details key={title} className="border-t border-border py-4 text-xs">
          <summary className="flex cursor-pointer list-none justify-between">
            {title}
            <Plus size={13} />
          </summary>
          <p className="pt-4 leading-6 text-neutral-500">
            {
              [
                "Responsibly sourced natural fibres. Expertly cut and finished with considered detailing. Designed in our atelier.",
                "Complimentary shipping on orders over $250. Standard delivery in 3–5 business days. Return unworn pieces within 30 days.",
                "Professional dry clean recommended. Store with care in a cool, dry place.",
              ][index]
            }
          </p>
        </details>
      ))}
      {guide && (
        <Modal close={() => setGuide(false)} title="Size guide">
          <h2 className="mb-6 font-serif text-4xl">Find your perfect fit</h2>
          <p className="mb-6 text-xs">
            Measurements in centimetres. Choose your usual size for a relaxed
            fit.
          </p>
          <table className="w-full text-left text-xs">
            <thead>
              <tr>
                {["Size", "Bust", "Waist", "Hip"].map((value) => (
                  <th className="border-b py-4" key={value}>
                    {value}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["XS", "S", "M", "L", "XL"].map((value, index) => (
                <tr key={value}>
                  <td className="border-b py-4">{value}</td>
                  {[82, 64, 90].map((measure) => (
                    <td className="border-b" key={measure}>
                      {measure + index * 4}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}
    </div>
  )
}
function ProductPage() {
  const { id } = useParams()
  const product = products.find((item) => item.id === id)
  const [selected, setSelected] = useState(0)
  const [recent, setRecent] = useState<string[]>([])
  useEffect(() => {
    setSelected(0)
    let previous: string[] = []
    try {
      previous = JSON.parse(localStorage.getItem("azya-recent") || "[]")
    } catch {}
    setRecent(previous.filter((value) => value !== id))
    if (id)
      localStorage.setItem(
        "azya-recent",
        JSON.stringify(
          [id, ...previous.filter((value) => value !== id)].slice(0, 4),
        ),
      )
  }, [id])
  if (!product)
    return (
      <Empty
        title="This piece is not available."
        description="Explore the rest of our considered collection."
      />
    )
  const gallery = [
    product.image,
    images[(products.indexOf(product) + 3) % images.length],
  ]
  return (
    <div className="mx-auto max-w-[1500px] px-6 py-10 lg:px-14">
      <p className="mb-8 text-[10px] text-neutral-500">
        <Link to="/collection">Collection</Link> / {product.category} /{" "}
        {product.name}
      </p>
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          <img
            src={gallery[selected]}
            alt={`${product.name} view ${selected + 1}`}
            className="aspect-[4/5] w-full object-cover"
          />
          <div className="mt-4 flex gap-3">
            {gallery.map((image, index) => (
              <button
                key={image}
                aria-label={`View image ${index + 1}`}
                onClick={() => setSelected(index)}
                className={
                  selected === index ? "border border-neutral-800 p-1" : "p-1"
                }
              >
                <img
                  src={image}
                  alt="Product gallery thumbnail"
                  className="h-24 w-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        <ProductInfo key={id} product={product} />
      </div>
      <h2 className="mb-8 mt-20 font-serif text-4xl">Complete your wardrobe</h2>
      <ProductGrid
        items={products.filter((item) => item.id !== id).slice(0, 4)}
      />
      {recent.length > 0 && (
        <>
          <h2 className="mb-8 mt-16 font-serif text-4xl">
            Recently considered
          </h2>
          <ProductGrid
            items={products.filter((item) => recent.includes(item.id))}
          />
        </>
      )}
    </div>
  )
}
function About() {
  return (
    <>
      <section className="px-7 py-20 text-center">
        <p className={`${label} mb-6`}>THE HOUSE OF AZYA</p>
        <h1 className="font-serif text-6xl md:text-8xl">
          An instinct for <span className="italic">elegance.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-xs leading-7 text-neutral-500">
          We believe the most beautiful things don't ask for attention.
          <br />
          They simply stay with you.
        </p>
      </section>
      <img
        src={images[4]}
        alt="The AZYA world, a quiet fashion editorial"
        className="h-[550px] w-full object-cover grayscale"
      />
      <div className="mx-auto grid max-w-5xl gap-16 px-7 py-24 md:grid-cols-2">
        <h2 className="font-serif text-5xl">
          A modern house.
          <br />A timeless point of view.
        </h2>
        <div className="space-y-6 text-sm leading-8 text-neutral-500">
          <p>
            AZYA is a modern women's fashion house founded on a simple
            conviction: elegance is not an occasion. It is a way of being.
          </p>
          <p>
            Our collections explore the balance between strength and softness.
            Refined silhouettes, thoughtful proportions and tactile fabrics come
            together in pieces that feel as natural as they look extraordinary.
          </p>
          <p>
            From the first sketch to the final stitch, we work with intention.
            Every detail has a purpose. Every piece has a place in your story.
          </p>
          <TextLink to="/collection">Discover our collection</TextLink>
        </div>
      </div>
      <div className="grid gap-8 bg-neutral-100 px-8 py-16 text-center md:grid-cols-3">
        {[
          ["01", "Considered design", "Quiet silhouettes, designed to endure."],
          ["02", "Exceptional craft", "An uncompromising devotion to detail."],
          ["03", "Timeless femininity", "A wardrobe that evolves with you."],
        ].map(([number, title, text]) => (
          <div key={number}>
            <p className={label}>{number}</p>
            <h3 className="my-4 font-serif text-3xl">{title}</h3>
            <p className="text-xs text-neutral-500">{text}</p>
          </div>
        ))}
      </div>
    </>
  )
}
function Empty({ title, description }: {
  title: string
  description: string
}) {
  return (
    <div className="px-6 py-24 text-center">
      <ShoppingBag className="mx-auto mb-6" size={28} strokeWidth={1} />
      <h1 className="font-serif text-4xl">{title}</h1>
      <p className="mb-8 mt-4 text-xs text-neutral-500">{description}</p>
      <TextLink to="/collection">Explore the collection</TextLink>
    </div>
  )
}
function Bag() {
  const { bag, setBag } = useStore()
  const subtotal = bag.reduce(
    (sum, item) =>
      sum +
      products.find((product) => product.id === item.id)!.price * item.qty,
    0,
  )
  if (!bag.length)
    return (
      <Empty
        title="Room for something extraordinary."
        description="Your shopping bag is currently empty."
      />
    )
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-10 font-serif text-5xl">
        Your shopping bag{" "}
        <span className="font-sans text-xs">({bag.length})</span>
      </h1>
      <div className="grid gap-16 md:grid-cols-[1.6fr_1fr]">
        <div>
          {bag.map((item, index) => {
            const product = products.find((product) => product.id === item.id)!
            return (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="flex gap-5 border-t py-6"
              >
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-40 w-28 object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between text-sm">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                    <span>{money(product.price * item.qty)}</span>
                  </div>
                  <p className="mt-3 text-xs text-neutral-500">
                    {item.color} / Size {item.size}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border">
                      <button
                        aria-label="Decrease quantity"
                        className="p-3"
                        onClick={() =>
                          setBag((previous) =>
                            previous.map((value, position) =>
                              position === index
                                ? { ...value, qty: Math.max(1, value.qty - 1) }
                                : value,
                            ),
                          )
                        }
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs">{item.qty}</span>
                      <button
                        aria-label="Increase quantity"
                        className="p-3"
                        onClick={() =>
                          setBag((previous) =>
                            previous.map((value, position) =>
                              position === index
                                ? { ...value, qty: value.qty + 1 }
                                : value,
                            ),
                          )
                        }
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      className="text-[10px] underline"
                      onClick={() =>
                        setBag((previous) =>
                          previous.filter((_, position) => position !== index),
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="h-fit bg-neutral-100 p-7">
          <h2 className="mb-8 font-serif text-3xl">Order summary</h2>
          <div className="flex justify-between text-xs">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="my-5 flex justify-between text-xs">
            <span>Standard shipping</span>
            <span>{subtotal >= 250 ? "Complimentary" : "$15"}</span>
          </div>
          <div className="mb-7 flex justify-between border-t pt-5 text-sm">
            <span>Estimated total</span>
            <span>{money(subtotal + (subtotal >= 250 ? 0 : 15))}</span>
          </div>
          <Link
            className={`${label} block bg-neutral-900 p-5 text-center text-white hover:bg-neutral-700`}
            to="/checkout"
          >
            Proceed to checkout
          </Link>
          <p className="mt-5 flex items-center justify-center gap-2 text-[10px] text-neutral-500">
            <LockKeyhole size={12} />
            Secure checkout
          </p>
        </div>
      </div>
      <h2 className="mb-8 mt-20 font-serif text-4xl">A beautiful complement</h2>
      <ProductGrid />
    </div>
  )
}
function Field({
  title,
  type = "text",
  required = true,
  placeholder = "",
}: {
  title: string
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className="block text-[10px] tracking-wide">
      {title}
      <input
        required={required}
        type={type}
        placeholder={placeholder}
        className="mt-2 block h-12 w-full border border-border bg-transparent px-4 text-sm focus:border-neutral-800 focus:outline-none"
      />
    </label>
  )
}
function Checkout() {
  const { bag, setBag } = useStore()
  const [delivery, setDelivery] = useState("standard")
  const [placed, setPlaced] = useState(false)
  const [payment, setPayment] = useState("card")
  const subtotal = bag.reduce(
    (sum, item) =>
      sum +
      products.find((product) => product.id === item.id)!.price * item.qty,
    0,
  )
  const shipping = delivery === "express" ? 25 : subtotal >= 250 ? 0 : 15
  if (placed)
    return (
      <div className="mx-auto max-w-2xl px-8 py-24 text-center">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border">
          <Check size={25} strokeWidth={1} />
        </div>
        <p className={`${label} mb-6`}>ORDER AZ-2026-0841 CONFIRMED</p>
        <h1 className="font-serif text-6xl">A beautiful choice.</h1>
        <p className="mb-10 mt-6 text-sm leading-7 text-neutral-500">
          Thank you for welcoming AZYA into your wardrobe.
          <br />
          Your mock order is confirmed. No payment has been charged.
        </p>
        <TextLink to="/collection">Continue discovering</TextLink>
      </div>
    )
  if (!bag.length)
    return (
      <Empty
        title="Your collection awaits."
        description="Add a piece to your bag before checking out."
      />
    )
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <Link to="/bag" className="mb-8 flex items-center gap-3 text-xs">
        <ArrowLeft size={14} />
        Return to bag
      </Link>
      <h1 className="mb-3 font-serif text-5xl">A little closer to yours.</h1>
      <p className="mb-10 text-[10px] text-neutral-500">
        INTERACTIVE DEMO — PLEASE USE SAMPLE INFORMATION ONLY
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setPlaced(true)
          setBag([])
          window.scrollTo(0, 0)
        }}
        className="grid gap-16 md:grid-cols-[1.3fr_1fr]"
      >
        <div className="space-y-9">
          <section>
            <h2 className="mb-5 font-serif text-3xl">01. Contact</h2>
            <Field
              title="Email address"
              type="email"
              placeholder="you@example.com"
            />
          </section>
          <section>
            <h2 className="mb-5 font-serif text-3xl">02. Shipping address</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field title="First name" />
              <Field title="Last name" />
              <div className="sm:col-span-2">
                <Field title="Street address" />
              </div>
              <Field title="City" />
              <Field title="Postal code" />
              <label className="text-[10px]">
                Country
                <select className="mt-2 h-12 w-full border px-4 text-xs">
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>France</option>
                  <option>Germany</option>
                </select>
              </label>
              <Field title="Phone (optional)" type="tel" required={false} />
            </div>
          </section>
          <section>
            <h2 className="mb-5 font-serif text-3xl">03. Delivery</h2>
            {["standard", "express"].map((value) => (
              <label
                key={value}
                className="flex items-center gap-3 border p-5 text-xs"
              >
                <input
                  className="accent-neutral-900"
                  type="radio"
                  checked={delivery === value}
                  onChange={() => setDelivery(value)}
                />
                {value === "standard"
                  ? "Standard · 3–5 business days"
                  : "Express · 1–2 business days"}
                <span className="ml-auto">
                  {value === "standard"
                    ? subtotal >= 250
                      ? "Complimentary"
                      : "$15"
                    : "$25"}
                </span>
              </label>
            ))}
          </section>
          <section>
            <h2 className="mb-5 font-serif text-3xl">04. Payment</h2>
            <label className="flex gap-3 border p-5 text-xs">
              <input
                type="radio"
                checked={payment === "card"}
                onChange={() => setPayment("card")}
                className="accent-neutral-900"
              />
              Demo credit / debit card
            </label>
            <div className="space-y-5 border border-t-0 p-5">
              <Field title="Cardholder name" />
              <Field
                title="Sample card number"
                placeholder="4242 4242 4242 4242"
              />
              <div className="grid grid-cols-2 gap-5">
                <Field title="Expiry" placeholder="MM / YY" />
                <Field title="Security code" placeholder="123" />
              </div>
              <p className="text-[10px] text-neutral-500">
                Simulation only. Do not enter real payment details.
              </p>
            </div>
          </section>
          <Button type="submit" className="w-full">
            Confirm demo order · {money(subtotal + shipping)}
          </Button>
        </div>
        <aside className="h-fit bg-neutral-100 p-7">
          <h2 className="mb-6 font-serif text-3xl">Your selection</h2>
          {bag.map((item, index) => {
            const product = products.find((product) => product.id === item.id)!
            return (
              <div className="mb-5 flex items-center gap-4" key={index}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-24 w-16 object-cover"
                />
                <div className="flex-1 text-xs">
                  <p>{product.name}</p>
                  <p className="my-2 text-neutral-500">
                    {item.size} / {item.color} / Qty {item.qty}
                  </p>
                  <p>{money(product.price * item.qty)}</p>
                </div>
              </div>
            )
          })}
          <div className="space-y-4 border-t pt-5 text-xs">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{shipping ? money(shipping) : "Complimentary"}</span>
            </div>
            <div className="flex justify-between border-t pt-5 text-sm">
              <span>Total</span>
              <span>{money(subtotal + shipping)}</span>
            </div>
          </div>
          <p className="mt-6 flex items-center gap-2 text-[10px]">
            <LockKeyhole size={13} />
            Your details stay in this demo
          </p>
        </aside>
      </form>
    </div>
  )
}
function SearchPage() {
  const [query, setQuery] = useState("")
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("azya-searches") || "[]")
    } catch {
      return []
    }
  })
  const results = products.filter((product) =>
    `${product.name} ${product.category} ${product.color}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )
  const save = (value: string) => {
    if (!value.trim()) return
    const values = [value, ...recent.filter((item) => item !== value)].slice(
      0,
      5,
    )
    setRecent(values)
    localStorage.setItem("azya-searches", JSON.stringify(values))
  }
  return (
    <section className="mx-auto min-h-[650px] max-w-7xl px-7 py-16">
      <div className="flex items-center justify-between">
        <p className={label}>FIND SOMETHING EXTRAORDINARY</p>
        <Link to="/" aria-label="Close search">
          <X size={24} strokeWidth={1} />
        </Link>
      </div>
      <form
        className="mt-10 flex items-center border-b border-neutral-700 pb-5"
        onSubmit={(event) => {
          event.preventDefault()
          save(query)
        }}
      >
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="What speaks to you?"
          aria-label="Search products"
          className="w-full bg-transparent font-serif text-4xl outline-none md:text-6xl"
        />
        <button aria-label="Submit search">
          <Search size={26} strokeWidth={1} />
        </button>
      </form>
      {!query && (
        <div className="mb-14 mt-10 grid gap-9 sm:grid-cols-3">
          <div>
            <p className={`${label} mb-5 text-neutral-500`}>
              SUGGESTED SEARCHES
            </p>
            {["Silk", "Trench", "Noir"].map((value) => (
              <button
                key={value}
                onClick={() => {
                  setQuery(value)
                  save(value)
                }}
                className="mb-3 block font-serif text-2xl"
              >
                {value}
              </button>
            ))}
          </div>
          <div>
            <p className={`${label} mb-5 text-neutral-500`}>
              POPULAR CATEGORIES
            </p>
            {["Dresses", "Outerwear", "Accessories"].map((value) => (
              <Link
                key={value}
                to={`/collection?category=${value}`}
                className="mb-3 block font-serif text-2xl"
              >
                {value}
              </Link>
            ))}
          </div>
          <div>
            <p className={`${label} mb-5 text-neutral-500`}>RECENT SEARCHES</p>
            {recent.length ? (
              recent.map((value) => (
                <button
                  key={value}
                  className="mb-3 block text-xs"
                  onClick={() => setQuery(value)}
                >
                  {value}
                </button>
              ))
            ) : (
              <p className="text-xs text-neutral-400">
                Your discoveries will appear here.
              </p>
            )}
          </div>
        </div>
      )}
      <p className={`${label} my-8`}>
        {query ? `${results.length} RESULTS FOR “${query}”` : "CURATED FOR YOU"}
      </p>
      {results.length ? (
        <ProductGrid items={query ? results : products.slice(0, 4)} />
      ) : (
        <Empty
          title="A different expression, perhaps?"
          description="No pieces found. Try a product name, colour or category."
        />
      )}
    </section>
  )
}
function Account() {
  const [params, setParams] = useSearchParams()
  const tab = params.get("tab") || "Profile"
  const { wishlist, notify } = useStore()
  const [signed, setSigned] = useState(false)
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className={`${label} mb-4`}>YOUR AZYA WORLD</p>
      <h1 className="mb-12 font-serif text-5xl">A space of your own.</h1>
      <div className="grid gap-12 md:grid-cols-[200px_1fr]">
        <nav className="flex flex-wrap gap-5 md:flex-col">
          {[
            "Profile",
            "Orders",
            "Wishlist",
            "Saved addresses",
            "Payment methods",
            "Account settings",
          ].map((value) => (
            <button
              className={`text-left text-xs ${
                value === tab
                  ? "underline underline-offset-8"
                  : "text-neutral-500"
              }`}
              key={value}
              onClick={() => setParams({ tab: value })}
            >
              {value}
            </button>
          ))}
          <Link to="/admin" className="mt-5 text-[10px] text-neutral-500">
            Administration demo <ArrowUpRight className="inline" size={12} />
          </Link>
        </nav>
        <div>
          {tab === "Wishlist" ? (
            wishlist.length ? (
              <ProductGrid
                items={products.filter((product) =>
                  wishlist.includes(product.id),
                )}
              />
            ) : (
              <Empty
                title="The pieces you love."
                description="Save your favourites using the heart on any piece."
              />
            )
          ) : tab === "Orders" ? (
            <Empty
              title="Your story is just beginning."
              description="You have no orders yet. Find your first forever piece."
            />
          ) : tab === "Payment methods" ? (
            <div>
              <h2 className="mb-5 font-serif text-3xl">Payment methods</h2>
              <p className="text-sm text-neutral-500">
                No saved payment methods. For your privacy, this mockup does not
                store payment information.
              </p>
            </div>
          ) : (
            <form
              className="max-w-lg space-y-6"
              onSubmit={(event) => {
                event.preventDefault()
                setSigned(true)
                notify("Your demo details have been updated.")
              }}
            >
              <h2 className="font-serif text-3xl">
                {tab === "Profile"
                  ? signed
                    ? "Welcome to your AZYA world."
                    : "Your personal details"
                  : tab}
              </h2>
              {tab === "Saved addresses" ? (
                <>
                  <Field title="Address name" placeholder="Home" />
                  <Field title="Street address" />
                  <div className="grid grid-cols-2 gap-4">
                    <Field title="City" />
                    <Field title="Postal code" />
                  </div>
                </>
              ) : (
                <>
                  <Field title="Full name" />
                  <Field title="Email address" type="email" />
                  {tab === "Account settings" && (
                    <label className="flex items-center gap-3 text-xs">
                      <input type="checkbox" className="accent-neutral-900" />
                      Receive collection previews and house updates
                    </label>
                  )}
                </>
              )}
              <p className="text-[10px] text-neutral-500">
                Demo profile. No personal information is sent to a server.
              </p>
              <Button type="submit">Save details</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
function Admin() {
  const [tab, setTab] = useState("Overview")
  const [role, setRole] = useState("Owner")
  const [search, setSearch] = useState("")
  const [range, setRange] = useState("30")
  const [stocks, setStocks] = useState(products.map(() => 24))
  const { notify } = useStore()
  const nav = [
    "Overview",
    "Orders",
    "Customers",
    "Products",
    "Inventory",
    "Categories",
    "Discounts",
    "Reviews",
    "Analytics",
    "Admin users",
    "Settings",
  ]
  return (
    <div className="grid min-h-[800px] bg-[#f7f7f5] lg:grid-cols-[220px_1fr]">
      <aside className="border-r bg-white p-7">
        <p className={`${label} mb-8`}>AZYA · ATELIER ADMIN</p>
        <nav className="flex flex-wrap gap-3 lg:flex-col">
          {nav.map((value) => (
            <button
              onClick={() => setTab(value)}
              key={value}
              className={`p-3 text-left text-xs ${
                tab === value
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:bg-neutral-100"
              }`}
            >
              {value}
            </button>
          ))}
        </nav>
        <label className="mt-9 block text-[10px]">
          Preview permissions
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="mt-2 w-full border p-3"
          >
            <option>Owner</option>
            <option>Editor</option>
            <option>Viewer</option>
          </select>
        </label>
        <p className="mt-4 text-[9px] leading-5 text-neutral-400">
          Simulated role-based UI. Not a secured admin backend.
        </p>
      </aside>
      <section className="min-w-0 p-6 md:p-10">
        <div className="mb-10 flex justify-between">
          <div>
            <p className={`${label} mb-3 text-neutral-500`}>
              YOUR HOUSE, AT A GLANCE
            </p>
            <h1 className="font-serif text-4xl">
              {tab === "Overview" ? "Good morning, Alexandra." : tab}
            </h1>
          </div>
          <select
            aria-label="Reporting period"
            value={range}
            onChange={(event) => setRange(event.target.value)}
            className="h-fit border bg-white p-3 text-xs"
          >
            <option value="30">Last 30 days</option>
            <option value="7">Last 7 days</option>
          </select>
        </div>
        {role === "Viewer" && (
          <p className="mb-6 border bg-white p-4 text-xs">
            Read-only access. Editing controls are disabled.
          </p>
        )}
        {["Overview", "Analytics"].includes(tab) ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Revenue", range === "30" ? "$128,450" : "$29,840", "+18.4%"],
                ["Orders", range === "30" ? "384" : "89", "+12.6%"],
                ["Customers", range === "30" ? "1,204" : "282", "+8.2%"],
                ["Average order", "$334.50", "+5.1%"],
              ].map(([title, value, growth]) => (
                <div className="border border-border bg-white p-6" key={title}>
                  <p className={`${label} text-neutral-500`}>{title}</p>
                  <p className="my-5 font-serif text-4xl">{value}</p>
                  <p className="text-[10px]">
                    {growth}{" "}
                    <span className="text-neutral-400">
                      vs. previous period
                    </span>
                  </p>
                </div>
              ))}
            </div>
            <div className="my-7 border bg-white p-7">
              <h2 className="font-serif text-2xl">Revenue performance</h2>
              <div className="mt-7 flex h-48 items-end gap-3 border-b">
                {[35, 49, 42, 61, 55, 75, 59, 80, 70, 90, 83, 100].map(
                  (height, index) => (
                    <div
                      title={`Period ${index + 1}`}
                      key={index}
                      className={`flex-1 bg-neutral-700 transition-colors hover:bg-neutral-400 ${["h-[35%]", "h-[49%]", "h-[42%]", "h-[61%]", "h-[55%]", "h-[75%]", "h-[59%]", "h-[80%]", "h-[70%]", "h-[90%]", "h-[83%]", "h-full"][index]}`}
                    />
                  ),
                )}
              </div>
              <div className="mt-3 flex justify-between text-[9px] text-neutral-500">
                <span>01 SEPT</span>
                <span>15 SEPT</span>
                <span>30 SEPT</span>
              </div>
            </div>
            <h2 className="mb-5 font-serif text-3xl">Recent orders</h2>
            <AdminTable type="Orders" />
          </>
        ) : ["Products", "Inventory"].includes(tab) ? (
          <>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search pieces…"
              aria-label="Search admin products"
              className="mb-6 w-full border bg-white p-4 text-xs"
            />
            <div className="overflow-auto bg-white">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr>
                    {["Piece", "Category", "Price", "Stock", "Status"].map(
                      (value) => (
                        <th className="border-b p-4 font-medium" key={value}>
                          {value}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter((product) =>
                      product.name.toLowerCase().includes(search.toLowerCase()),
                    )
                    .map((product) => (
                      <tr key={product.id}>
                        <td className="flex min-w-52 items-center gap-3 p-4">
                          <img
                            src={product.image}
                            alt=""
                            className="h-12 w-9 object-cover"
                          />
                          {product.name}
                        </td>
                        <td className="p-4">{product.category}</td>
                        <td className="p-4">{money(product.price)}</td>
                        <td className="p-4">
                          <input
                            aria-label={`Stock for ${product.name}`}
                            disabled={role === "Viewer"}
                            type="number"
                            min="0"
                            value={stocks[products.indexOf(product)]}
                            onChange={(event) =>
                              setStocks((previous) =>
                                previous.map((value, index) =>
                                  index === products.indexOf(product)
                                    ? Math.max(0, Number(event.target.value))
                                    : value,
                                ),
                              )
                            }
                            className="w-16 border p-2"
                          />
                        </td>
                        <td className="p-4">
                          {stocks[products.indexOf(product)] > 0
                            ? "Active"
                            : "Sold out"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {role !== "Viewer" && (
              <Button
                className="mt-6"
                onClick={() => notify("Inventory updated in this demo.")}
              >
                Save inventory
              </Button>
            )}
          </>
        ) : ["Orders", "Customers", "Reviews", "Admin users"].includes(tab) ? (
          <AdminTable type={tab} />
        ) : tab === "Categories" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {["Dresses", "Tops", "Outerwear", "Bottoms", "Accessories"].map(
              (value) => (
                <div className="border bg-white p-6" key={value}>
                  <h2 className="font-serif text-2xl">{value}</h2>
                  <p className="mt-3 text-xs text-neutral-500">
                    {
                      products.filter((product) => product.category === value)
                        .length
                    }{" "}
                    pieces
                  </p>
                </div>
              ),
            )}
          </div>
        ) : (
          <form
            className="max-w-lg space-y-6 border bg-white p-7"
            onSubmit={(event) => {
              event.preventDefault()
              if (role !== "Viewer") notify(`${tab} saved in this demo.`)
            }}
          >
            <Field
              title={tab === "Discounts" ? "Discount code" : "House name"}
              placeholder={tab === "Discounts" ? "WELCOME10" : "AZYA"}
            />
            <Field
              title={
                tab === "Discounts" ? "Discount percentage" : "Contact email"
              }
              type={tab === "Discounts" ? "number" : "email"}
            />
            {role !== "Viewer" && (
              <Button type="submit">Save {tab.toLowerCase()}</Button>
            )}
          </form>
        )}
      </section>
    </div>
  )
}
function AdminTable({ type }: { type: string }) {
  const headings =
    type === "Admin users"
      ? ["Name", "Email", "Role", "Status"]
      : type === "Reviews"
        ? ["Customer", "Product", "Rating", "Status"]
        : type === "Customers"
          ? ["Customer", "Email", "Orders", "Lifetime value"]
          : ["Order", "Customer", "Total", "Status"]
  const rows =
    type === "Admin users"
      ? [
          ["Alexandra Moreau", "alexandra@azya.demo", "Owner", "Active"],
          ["Clara Laurent", "clara@azya.demo", "Editor", "Active"],
          ["Emma Dubois", "emma@azya.demo", "Viewer", "Active"],
        ]
      : type === "Reviews"
        ? [
            ["Camille R.", "The Sculpted Trench", "5 / 5", "Published"],
            ["Olivia S.", "The Élan Silk Dress", "5 / 5", "Published"],
            ["Emma L.", "The Atelier Wool Coat", "4 / 5", "Pending"],
          ]
        : type === "Customers"
          ? [
              ["Camille Roche", "camille@example.com", "4", "$1,420"],
              ["Olivia Smith", "olivia@example.com", "2", "$810"],
              ["Emma Laurent", "emma@example.com", "1", "$485"],
            ]
          : [
              ["AZ-0841", "Camille Roche", "$485", "Processing"],
              ["AZ-0840", "Olivia Smith", "$810", "Shipped"],
              ["AZ-0839", "Emma Laurent", "$325", "Delivered"],
            ]
  return (
    <div className="overflow-auto border bg-white">
      <table className="w-full whitespace-nowrap text-left text-xs">
        <thead>
          <tr>
            {headings.map((value) => (
              <th
                className="border-b p-5 font-medium text-neutral-500"
                key={value}
              >
                {value}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((value, index) => (
                <td className="border-b p-5" key={index}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
function Footer() {
  const { notify } = useStore()
  const [email, setEmail] = useState("")
  const [info, setInfo] = useState("")
  return (
    <>
      <section className="flex flex-col items-center justify-between gap-8 border-y border-border bg-[#f5f5f3] px-7 py-14 md:flex-row lg:px-14">
        <div>
          <p className={`${label} mb-4 text-neutral-500`}>
            AN INVITATION TO OUR WORLD
          </p>
          <h2 className="font-serif text-3xl md:text-4xl">
            Be the first to discover.
          </h2>
          <p className="mt-3 text-[11px] text-neutral-500">
            New collections, considered stories, and a little inspiration.
          </p>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            notify("Welcome to the world of AZYA. You're on our demo list.")
            setEmail("")
          }}
          className="w-full max-w-md"
        >
          <div className="flex border-b border-neutral-500 pb-3">
            <input
              aria-label="Newsletter email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-transparent text-xs outline-none"
            />
            <button aria-label="Subscribe" className="p-2">
              <ArrowRight size={19} strokeWidth={1.2} />
            </button>
          </div>
          <p className="mt-4 text-[9px] text-neutral-500">
            By subscribing, you agree to our privacy policy. Unsubscribe
            anytime.
          </p>
        </form>
      </section>
      <footer className="px-7 py-14 lg:px-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <Link className="font-serif text-5xl tracking-[0.16em]" to="/">
              AZYA
            </Link>
            <p className="mt-5 text-[11px] leading-6 text-neutral-500">
              Quiet elegance.
              <br />
              Enduring expression.
            </p>
          </div>
          <div>
            <h3 className={`${label} mb-6`}>Explore</h3>
            <div className="flex flex-col gap-4 text-[11px] text-neutral-500">
              <Link to="/collection?category=New%20Arrivals">New arrivals</Link>
              <Link to="/collection">The collections</Link>
              <Link to="/about">The house of AZYA</Link>
              <Link to="/about">The journal</Link>
            </div>
          </div>
          <div>
            <h3 className={`${label} mb-6`}>Client services</h3>
            <div className="flex flex-col items-start gap-4 text-[11px] text-neutral-500">
              {[
                "Contact us",
                "Shipping & returns",
                "Size guide",
                "Care guide",
              ].map((value) => (
                <button key={value} onClick={() => setInfo(value)}>
                  {value}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className={`${label} mb-6`}>Connect</h3>
            <div className="flex flex-col items-start gap-4 text-[11px] text-neutral-500">
              <button onClick={() => setInfo("Instagram")}>
                Instagram <ArrowUpRight size={11} className="inline" />
              </button>
              <button onClick={() => setInfo("Pinterest")}>
                Pinterest <ArrowUpRight size={11} className="inline" />
              </button>
              <Link to="/account">My account</Link>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-wrap justify-between gap-5 border-t border-border pt-6 text-[9px] text-neutral-500">
          <p>© 2026 AZYA. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => setInfo("Privacy policy")}>
              Privacy policy
            </button>
            <button onClick={() => setInfo("Terms & conditions")}>
              Terms & conditions
            </button>
            <span>United States · USD $</span>
          </div>
        </div>
      </footer>
      {info && (
        <Modal close={() => setInfo("")} title={info}>
          <h2 className="mb-6 font-serif text-4xl">{info}</h2>
          <p className="max-w-xl text-sm leading-8 text-neutral-500">
            {info === "Shipping & returns"
              ? "Complimentary standard delivery on orders over $250. Your pieces arrive in 3–5 business days. Unworn pieces can be returned within 30 days."
              : info === "Care guide"
                ? "Care for your pieces as thoughtfully as they were made. Follow the individual garment label. Professional dry cleaning is recommended for silk, wool and tailored pieces."
                : info === "Size guide"
                  ? "Our pieces are available in XS–XL. Find detailed measurements and fit advice in the size guide on each product page."
                  : info === "Contact us"
                    ? "Our client services team would be delighted to help. In this concept experience, contact is illustrative: clientservices@azya.demo."
                    : info === "Privacy policy"
                      ? "This interactive mockup stores your bag, wishlist and recent searches locally in your browser. No contact or payment information is sent to a server."
                      : info === "Terms & conditions"
                        ? "AZYA is an interactive fashion e-commerce concept. Product imagery is illustrative, prices are samples, and orders do not result in purchases or charges."
                        : "A glimpse into the world of AZYA. Social channels are illustrative in this concept experience."}
          </p>
        </Modal>
      )}
    </>
  )
}
const router = createBrowserRouter([
  {
    Component: Shell,
    children: [
      { index: true, Component: Home },
      { path: "collection", Component: Collection },
      { path: "product/:id", Component: ProductPage },
      { path: "about", Component: About },
      { path: "bag", Component: Bag },
      { path: "checkout", Component: Checkout },
      { path: "search", Component: SearchPage },
      { path: "account", Component: Account },
      { path: "admin", Component: Admin },
      {
        path: "*",
        element: (
          <Empty
            title="A page yet to be discovered."
            description="Return to the collection to continue exploring."
          />
        ),
      },
    ],
  },
])
export default function App() {
  return <RouterProvider router={router} />
}
