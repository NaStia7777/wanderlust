import { useEffect, useRef, useState } from 'react';
import { X, Search, MapPinned, Compass } from 'lucide-react';
import { categories } from '../../../data/categories';
import { placesAPI } from '../../../store/api/places';
import { CategoryNode, getAllChildIds } from './logic';
import { IBoundingBox, IPlaceInfo, IRequestGetPlaces } from '../../../models/places';
import PlaceCard from './PlaceCard';
import CategoryTree from './CategoryTree';
import { Pagination } from '../../common/Pagination';
import { SelectTerrForm } from './SelectTerrForm';

interface AddPlaceFormProps {
  onClose: () => void;
  onSubmit: (places: IPlaceInfo[]) => void;
}

function getSelectedCategoriesInNode(selectedCategories: Set<string>, currentCattegories: CategoryNode, result: string[]) {
  if (currentCattegories.children) {
    const allChildIds = getAllChildIds(currentCattegories);
    const allSelected = allChildIds.every(id => selectedCategories.has(id));
    if (allSelected) result.push(currentCattegories.id);
    else
      currentCattegories.children.forEach(item => getSelectedCategoriesInNode(selectedCategories, item, result));
  }
  else if (selectedCategories.has(currentCattegories.id)) {
    result.push(currentCattegories.id);
  }
}

function getSelectedCategories(selectedCategories: Set<string>) {
  const result: string[] = [];
  categories.forEach(item => getSelectedCategoriesInNode(selectedCategories, item, result));
  return result.join(',');
}

export function AddPlaceForm({ onClose, onSubmit }: AddPlaceFormProps) {
  const resultBlockRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [boundingbox, setBoundingBox] = useState<IBoundingBox>({ lon_min: -179, lon_max: 179, lat_min: -89, lat_max: 89 });
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(getAllChildIds(categories[0])));
  const [selectedPlaces, setSelectedPlaces] = useState<IPlaceInfo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<IRequestGetPlaces>({ boundingBox: boundingbox, name: searchTerm, kinds: getSelectedCategories(selectedCategories) });
  const { data, isFetching, error } = placesAPI.useFetchPlacesQuery(filter);
  const [selectTerrFormShow, setSelectTerrFormShow] = useState(false);
  useEffect(() => {
    if (resultBlockRef.current) {
      // Прокрутка до верху
      resultBlockRef.current.scrollTo({
        top: 0,
        behavior: 'instant',
      });
    }
  }, [page]);

  const handleClose = () => {
    onSubmit(selectedPlaces);
    onClose();
  }
  const handleCategoryToggle = (allChildIds: string[], parentIds: string[]) => {
    const newSelected = new Set(selectedCategories);
    const isCurrentlySelected = allChildIds.every(id => newSelected.has(id));
    if (isCurrentlySelected) {
      // Remove all child categories and the current category
      allChildIds.forEach(id => newSelected.delete(id));
      // Remove parent categories if no siblings are selected
      parentIds.forEach(parentId => {
        const parent = categories.find(cat => cat.id === parentId);
        if (parent && getAllChildIds(parent).every(id => !newSelected.has(id) || parent.id === id)) {
          newSelected.delete(parentId);
        }
      });
    } else {
      // Add all child categories
      allChildIds.forEach(id => newSelected.add(id));
      // Add parent categories
      parentIds.forEach(id => newSelected.add(id));
    }

    setSelectedCategories(newSelected);
  };

  const handlePlaceToggle = (place?: IPlaceInfo) => {
    if (!place) return;
    setSelectedPlaces(places => {
      if (places.some(item => item.xid === place.xid)) {
        return places.filter(item => item.xid !== place.xid);
      } else {
        return [place, ...places];
      }
    });
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${selectTerrFormShow && 'hidden'}`}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold">Add Place</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(90vh-88px)]">
            {/* Left Column - Search and Categories */}
            <div className="lg:col-span-1 border-r flex flex-col h-[calc(90vh-88px)]">
              <div className="px-6 py-4 border-b">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setFilter({ name: searchTerm, kinds: getSelectedCategories(selectedCategories), boundingBox: boundingbox });
                        setPage(1);
                      }
                    }}
                    placeholder="Search places..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  />
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => setSelectTerrFormShow(true)}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MapPinned className="w-5 h-5" />
                    Sellect territory
                  </button>
                </div>
              </div>
              <h3 className="font-semibold my-2 ml-6">Categories</h3>

              <div className="flex-1 max-h-full overflow-y-auto px-6">
                {categories.map((category) => (
                  <CategoryTree
                    key={category.id}
                    category={category}
                    selectedCategories={selectedCategories}
                    onToggle={handleCategoryToggle}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  setFilter({ name: searchTerm, kinds: getSelectedCategories(selectedCategories), boundingBox: boundingbox });
                  setPage(1);
                }}
                className="m-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-2 overflow-y-auto p-6" ref={resultBlockRef}>
              {isFetching ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-pulse">
                    <Compass className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full text-red-500 text-sm">
                  Error loading data
                </div>
              ) : data && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {data.slice((page - 1) * 10, (page - 1) * 10 + 10).map((place) => (
                      <PlaceCard
                        key={place.xid}
                        xid={place.xid}
                        onToggle={handlePlaceToggle}
                        selectedPlaces={selectedPlaces}
                      />
                    ))}
                  </div>
                  <Pagination pages={Math.ceil(data.length / 10)} page={page} setPage={(page) => setPage(page)} />

                </>
              )}
            </div>

          </div>
        </div>
      </div>
      {selectTerrFormShow && <SelectTerrForm onClose={() => setSelectTerrFormShow(false)} boundingbox={boundingbox} setBoundingBox={setBoundingBox} />}
    </>
  );
}