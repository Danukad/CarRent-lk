import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { formatVehicleImageUrl, handleImageError } from "../utils/imageHelper";
import VehicleCard from "../components/VehicleCard";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
  CircleF,
} from "@react-google-maps/api";
import { Link, useSearchParams } from "react-router-dom";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useToast } from "../context/ToastContext";
import {
  MapPin,
  Car,
  Sliders,
  Sparkles,
  Navigation,
  Search,
  Star,
  Map,
  LayoutGrid,
  Trash2,
  LocateFixed,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";

// Image Imports
import bikeeImg from "../assets/images/bikee.jpg";
import threewheelerImg from "../assets/images/threewheeler.jpg";
import miniCarImg from "../assets/images/mini_car.png";
import carImg from "../assets/images/car.jpg";
import premiumCarImg from "../assets/images/premium_car.png";
import miniVanImg from "../assets/images/mini_van.png";
import vanImg from "../assets/images/van.jpg";
import othersCarImg from "../assets/images/others_car.png";

const listingMapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "1.5rem",
};

const sriLankaCenter = { lat: 7.8731, lng: 80.7718 };

const BLUE_SEARCH_PIN_SVG = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="60" viewBox="0 0 48 60">
  <defs>
    <filter id="b-shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>
  <path d="M24 2C11.85 2 2 11.85 2 24c0 16.5 22 34 22 34s22-17.5 22-34C46 11.85 36.15 2 24 2z" fill="#2563eb" stroke="#ffffff" stroke-width="3" filter="url(#b-shadow)"/>
  <circle cx="24" cy="22" r="8" fill="#ffffff"/>
  <circle cx="24" cy="22" r="4" fill="#2563eb"/>
</svg>
`);

const ORANGE_CAR_PIN_SVG = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="42" height="52" viewBox="0 0 42 52">
  <defs>
    <filter id="c-shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <path d="M21 2C10.5 2 2 10.5 2 21c0 14 19 29 19 29s19-15 19-29c0-10.5-8.5-19-19-19z" fill="#f97316" stroke="#ffffff" stroke-width="2.5" filter="url(#c-shadow)"/>
  <circle cx="21" cy="19" r="8" fill="#ffffff"/>
  <path d="M16 21c-.3 0-.5-.2-.5-.5V19l1-2.6c.2-.4.6-.6 1-.6h7c.4 0 .8.2 1 .6l1 2.6v1.5c0 .3-.2.5-.5.5h-.5c-.3 0-.5-.2-.5-.5V20H17v.5c0 .3-.2.5-.5.5H16zm1.2-3h7.6l-.6-1.6h-6.4l-.6 1.6zm-.7 2c.3 0 .6-.3.6-.6s-.3-.6-.6-.6-.6.3-.6.6.3.6.6.6zm8 0c.3 0 .6-.3.6-.6s-.3-.6-.6-.6-.6.3-.6.6.3.6.6.6z" fill="#ea580c"/>
</svg>
`);

// SVG generator for overlapping / clustered vehicle markers showing count badge (e.g. "3", "3+", "5+")
const getMultiVehiclePinSvg = (count) => {
  const countStr = count > 9 ? "9+" : `${count}`;
  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="58" viewBox="0 0 48 58">
  <defs>
    <filter id="m-shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
    <linearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff7a18"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- Main Orange Pin -->
  <path d="M24 2C13 2 4 11 4 22c0 15 20 34 20 34s20-19 20-34C44 11 35 2 24 2z" fill="url(#pinGrad)" stroke="#ffffff" stroke-width="2.5" filter="url(#m-shadow)"/>
  
  <!-- Center White Circle -->
  <circle cx="24" cy="20" r="10" fill="#ffffff"/>
  
  <!-- Car Silhouette Icon in Center -->
  <path d="M18.5 21.8c-.3 0-.5-.2-.5-.5v-1.2l1.2-2.8c.2-.4.6-.7 1.1-.7h7.4c.5 0 .9.3 1.1.7l1.2 2.8v1.2c0 .3-.2.5-.5.5h-.5c-.3 0-.5-.2-.5-.5v-.4h-7.6v.4c0 .3-.2.5-.5.5h-.8zm1.5-3h8l-.6-1.5h-6.8l-.6 1.5zm-.8 2c.3 0 .6-.3.6-.6s-.3-.6-.6-.6-.6.3-.6.6.3.6.6.6zm8.6 0c.3 0 .6-.3.6-.6s-.3-.6-.6-.6-.6.3-.6.6.3.6.6.6z" fill="#ea580c"/>

  <!-- Top Right Count Badge (${countStr}) -->
  <g transform="translate(23, -2)">
    <circle cx="12" cy="12" r="11" fill="url(#badgeGrad)" stroke="#ffffff" stroke-width="2.2"/>
    <text x="12" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">${countStr}</text>
  </g>
</svg>
`)
  );
};

const normalizeSearchText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Haversine formula to calculate distance between two coordinates in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const VehicleListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Helper to parse pinned coordinates from string or params
  const parseInitialPin = () => {
    const latP = searchParams.get("lat");
    const lngP = searchParams.get("lng");
    const locP = searchParams.get("location") || "";
    if (latP && lngP) {
      return {
        lat: parseFloat(latP),
        lng: parseFloat(lngP),
        address: locP || `Pinned Location (${parseFloat(latP).toFixed(4)}, ${parseFloat(lngP).toFixed(4)})`,
      };
    }
    const match = locP.match(/Pinned Location \(([0-9.-]+),\s*([0-9.-]+)\)/i);
    if (match) {
      return {
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2]),
        address: locP,
      };
    }
    return null;
  };

  const initialPin = parseInitialPin();

  // Read initial parameters directly from URL searchParams
  const [filter, setFilter] = useState({
    location: searchParams.get("location") || "",
    brand: searchParams.get("brand") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vehicleType, setVehicleType] = useState(
    searchParams.get("type") || searchParams.get("vehicleType") || ""
  );
  const [viewMode, setViewMode] = useState(searchParams.get("view") || "grid"); // "grid" or "map"
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [activeClusterIndex, setActiveClusterIndex] = useState(0);
  const [filterShow, setFilterShow] = useState("nearest");
  const [filterFuel, setFilterFuel] = useState(
    searchParams.get("fuel") || "any"
  );
  
  // GPS & Radius Search States
  const [userLocation, setUserLocation] = useState(null);
  const [pinnedLocation, setPinnedLocation] = useState(initialPin);
  const [radius, setRadius] = useState(
    parseInt(searchParams.get("radius")) || 20
  ); // default 20km radius
  const [mapCenter, setMapCenter] = useState(
    initialPin ? { lat: initialPin.lat, lng: initialPin.lng } : sriLankaCenter
  );
  const [mapZoom, setMapZoom] = useState(initialPin ? 11 : 8);
  const [currentZoom, setCurrentZoom] = useState(initialPin ? 11 : 8);
  const mapRef = React.useRef(null);
  const [isLocating, setIsLocating] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const { config } = useSiteConfig();
  const { toast } = useToast();
  const customThumbs = config?.vehicleListing?.categoryThumbnails || {};

  const vehicleTypeCards = [
    { id: "bicycle", title: "Bicycle", image: customThumbs.bicycle || bikeeImg },
    { id: "threewheeler", title: "Three-wheeler", image: customThumbs.threewheeler || threewheelerImg },
    { id: "mini-car", title: "Mini Car", image: customThumbs["mini-car"] || miniCarImg },
    { id: "car", title: "Car", image: customThumbs.car || carImg },
    { id: "premium-car", title: "Premium Car", image: customThumbs["premium-car"] || premiumCarImg },
    { id: "mini-van", title: "Mini Van", image: customThumbs["mini-van"] || miniVanImg },
    { id: "van", title: "Van", image: customThumbs.van || vanImg },
    { id: "others", title: "Others", image: customThumbs.others || othersCarImg },
  ];

  // Sync state changes to URL searchParams
  useEffect(() => {
    const params = new URLSearchParams();
    if (filter.location) params.set("location", filter.location);
    if (filter.brand) params.set("brand", filter.brand);
    if (filter.minPrice) params.set("minPrice", filter.minPrice);
    if (filter.maxPrice) params.set("maxPrice", filter.maxPrice);
    if (vehicleType) params.set("type", vehicleType);
    if (filterFuel && filterFuel !== "any") params.set("fuel", filterFuel);
    if (viewMode && viewMode !== "grid") params.set("view", viewMode);
    if (radius && radius !== 20) params.set("radius", radius);
    if (pinnedLocation) {
      params.set("lat", pinnedLocation.lat.toFixed(4));
      params.set("lng", pinnedLocation.lng.toFixed(4));
    }

    const paramStr = params.toString();
    if (paramStr !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [filter, vehicleType, filterFuel, viewMode, radius, pinnedLocation]);

  // Sync back when browser back/forward buttons are pressed
  useEffect(() => {
    const locParam = searchParams.get("location") || "";
    const brandParam = searchParams.get("brand") || "";
    const minPParam = searchParams.get("minPrice") || "";
    const maxPParam = searchParams.get("maxPrice") || "";
    const typeParam = searchParams.get("type") || searchParams.get("vehicleType") || "";
    const fuelParam = searchParams.get("fuel") || "any";
    const viewParam = searchParams.get("view") || "grid";
    const radiusParam = parseInt(searchParams.get("radius")) || 20;

    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");

    setFilter((prev) => {
      if (
        prev.location === locParam &&
        prev.brand === brandParam &&
        prev.minPrice === minPParam &&
        prev.maxPrice === maxPParam
      ) {
        return prev;
      }
      return { location: locParam, brand: brandParam, minPrice: minPParam, maxPrice: maxPParam };
    });
    setVehicleType((prev) => (prev === typeParam ? prev : typeParam));
    setFilterFuel((prev) => (prev === fuelParam ? prev : fuelParam));
    setViewMode((prev) => (prev === viewParam ? prev : viewParam));
    setRadius((prev) => (prev === radiusParam ? prev : radiusParam));

    if (latParam && lngParam) {
      const parsedLat = parseFloat(latParam);
      const parsedLng = parseFloat(lngParam);
      setPinnedLocation({
        lat: parsedLat,
        lng: parsedLng,
        address: locParam || `Pinned Location (${parsedLat.toFixed(4)}, ${parsedLng.toFixed(4)})`,
      });
      setMapCenter({ lat: parsedLat, lng: parsedLng });
      setMapZoom(11);
    } else {
      const match = locParam.match(/Pinned Location \(([0-9.-]+),\s*([0-9.-]+)\)/i);
      if (match) {
        const parsedLat = parseFloat(match[1]);
        const parsedLng = parseFloat(match[2]);
        setPinnedLocation({
          lat: parsedLat,
          lng: parsedLng,
          address: locParam,
        });
        setMapCenter({ lat: parsedLat, lng: parsedLng });
        setMapZoom(11);
      } else if (!locParam || locParam !== "My GPS Location") {
        setPinnedLocation(null);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/vehicles`);
        setVehicles(res.data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();

    // Auto-fetch user location just to show the blue pin on the map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
        },
        (error) => {
          console.warn("Auto-location failed:", error.message);
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    }
  }, []);

  const handleReset = () => {
    setFilter({
      location: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
    });
    setFilterShow("nearest");
    setFilterFuel("any");
    setVehicleType("");
    setUserLocation(null);
    setPinnedLocation(null);
    setSelectedVehicle(null);
    setSelectedCluster(null);
    setActiveClusterIndex(0);
    setRadius(20);
    setMapCenter(sriLankaCenter);
    setMapZoom(8);
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const handleClearPinnedLocation = () => {
    setPinnedLocation(null);
    setSelectedVehicle(null);
    setSelectedCluster(null);
    setActiveClusterIndex(0);
    if (filter.location && (filter.location.startsWith("Pinned Location") || filter.location === "My GPS Location")) {
      setFilter((prev) => ({ ...prev, location: "" }));
    }
    setMapCenter(sriLankaCenter);
    setMapZoom(8);
  };

  const handleMapClick = async (e) => {
    if (!e || !e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setSelectedVehicle(null);
    setSelectedCluster(null);
    setActiveClusterIndex(0);

    const initialPoint = {
      lat,
      lng,
      address: `Pinned Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    };
    setPinnedLocation(initialPoint);
    setRadius(20);
    setMapCenter({ lat, lng });
    setMapZoom(11);
    setFilter((prev) => ({ ...prev, location: initialPoint.address }));

    // Try reverse geocoding via Google Maps API
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (apiKey) {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const bestAddress = data.results[0].formatted_address;
          setPinnedLocation({ lat, lng, address: bestAddress });
          setFilter((prev) => ({ ...prev, location: bestAddress }));
          return;
        }
      }
    } catch (err) {
      console.warn("Reverse geocode error:", err);
    }
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      toast.warning("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userPos);
        setPinnedLocation({
          lat: userPos.lat,
          lng: userPos.lng,
          address: "My GPS Location",
        });
        setRadius(20);
        setMapCenter(userPos);
        setMapZoom(11);
        setFilter({ ...filter, location: "My GPS Location" });
        setViewMode("map");
        setIsLocating(false);
        toast.info("Filtering vehicles near your GPS location.");
      },
      (error) => {
        let errorMsg = `Unable to retrieve your location. (${error.message})`;
        if (error.code === error.PERMISSION_DENIED) {
           errorMsg = "Location permission denied. Please allow location access in your browser.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
           errorMsg = "Location information is currently unavailable on your device.";
        } else if (error.code === error.TIMEOUT) {
           errorMsg = "The request to get your location timed out. Please try again.";
        }
        toast.warning(errorMsg, "Location Notice");
        setIsLocating(false);
      },
      { timeout: 15000, maximumAge: 60000 }
    );
  };

  const activeCenter =
    pinnedLocation ||
    (userLocation && filter.location === "My GPS Location" ? userLocation : null);

  const filtered = vehicles
    .map((v) => {
      let distanceFromCenter = null;
      if (activeCenter && v.lat && v.lng) {
        distanceFromCenter = calculateDistance(
          activeCenter.lat,
          activeCenter.lng,
          v.lat,
          v.lng
        );
      }
      return { ...v, distanceFromCenter };
    })
    .filter((v) => {
      let matchLocation = true;
      if (activeCenter) {
        if (v.distanceFromCenter !== null) {
          matchLocation = v.distanceFromCenter <= radius;
        } else {
          matchLocation = false;
        }
      } else {
        const searchLocation = normalizeSearchText(filter.location);
        const vehicleLocation = normalizeSearchText(v.location);
        const companyLocation = normalizeSearchText(v.company?.address);
        const companyName = normalizeSearchText(v.company?.companyName);
        matchLocation =
          !searchLocation ||
          vehicleLocation.includes(searchLocation) ||
          companyLocation.includes(searchLocation) ||
          companyName.includes(searchLocation);
      }

      const matchBrand =
        !filter.brand ||
        v.brand?.toLowerCase().includes(filter.brand.toLowerCase());
      const matchMinPrice =
        !filter.minPrice || v.pricePerDay >= parseInt(filter.minPrice);
      const matchMaxPrice =
        !filter.maxPrice || v.pricePerDay <= parseInt(filter.maxPrice);
      const matchFuel =
        filterFuel === "any" || v.fuelType?.toLowerCase() === filterFuel;
      const matchType =
        !vehicleType ||
        v.vehicleType?.toLowerCase() === vehicleType.toLowerCase();
      return (
        matchBrand &&
        matchLocation &&
        matchMinPrice &&
        matchMaxPrice &&
        matchFuel &&
        matchType
      );
    })
    .sort((a, b) => {
      if (activeCenter && a.distanceFromCenter !== null && b.distanceFromCenter !== null) {
        return a.distanceFromCenter - b.distanceFromCenter;
      }
      return 0;
    });

  // Dynamic clustering threshold based on real map zoom level
  const getClusterDistanceThreshold = (zoom) => {
    if (zoom >= 16) return 0.01;  // 10 meters (street level zoom: only exact same spot/building stays grouped)
    if (zoom >= 15) return 0.035; // 35 meters
    if (zoom >= 14) return 0.10;  // 100 meters
    if (zoom >= 13) return 0.20;  // 200 meters
    if (zoom >= 12) return 0.35;  // 350 meters
    return 0.55;                  // 550 meters for city overview (zoom <= 11)
  };

  // Group vehicles by zoom-dependent proximity to resolve overlapping pins smoothly
  const vehicleClusters = React.useMemo(() => {
    const validVehicles = filtered.filter((v) => v.lat && v.lng);
    const clusters = [];
    const threshold = getClusterDistanceThreshold(currentZoom);

    validVehicles.forEach((vehicle) => {
      const vLat = Number(vehicle.lat);
      const vLng = Number(vehicle.lng);

      // Check if there is an existing cluster within the zoom threshold
      const existing = clusters.find((c) => {
        const dist = calculateDistance(c.lat, c.lng, vLat, vLng);
        return dist < threshold;
      });

      if (existing) {
        existing.vehicles.push(vehicle);
        // Recalculate centroid so pin sits at center of grouped cars
        const totalLat = existing.vehicles.reduce((sum, v) => sum + Number(v.lat), 0);
        const totalLng = existing.vehicles.reduce((sum, v) => sum + Number(v.lng), 0);
        existing.lat = totalLat / existing.vehicles.length;
        existing.lng = totalLng / existing.vehicles.length;
      } else {
        clusters.push({
          id: `cluster-${vehicle._id}`,
          lat: vLat,
          lng: vLng,
          vehicles: [vehicle],
        });
      }
    });

    return clusters;
  }, [filtered, currentZoom]);

  const handleMarkerClick = (cluster, e) => {
    if (e && e.domEvent) e.domEvent.stopPropagation();
    setSelectedCluster(cluster);
    setActiveClusterIndex(0);
    setSelectedVehicle(cluster.vehicles[0]);
  };

  const handleSidebarVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    if (vehicle.lat && vehicle.lng) {
      const matchingCluster = vehicleClusters.find((c) =>
        c.vehicles.some((v) => v._id === vehicle._id)
      );
      if (matchingCluster) {
        const idx = matchingCluster.vehicles.findIndex((v) => v._id === vehicle._id);
        setSelectedCluster(matchingCluster);
        setActiveClusterIndex(idx >= 0 ? idx : 0);
        setMapCenter({ lat: matchingCluster.lat, lng: matchingCluster.lng });
        setMapZoom(13);
      }
    }
  };

  return (
    <div className="listing-page">
      <div className="modern-header-section">
        <div className="top-badge">
          <Sparkles size={13} className="icon-orange-txt" />
          <span>Sri Lanka's modern car marketplace</span>
        </div>
        <h1 className="modern-title">
          Find the <span className="text-orange">nearest ride</span> in seconds.
        </h1>
        <p className="modern-subtitle">
          Search verified vehicles around you. Filter by brand, price range and fuel — book in a tap.
        </p>
      </div>

      <div className="container">
        <div className="search-card-block">
          <div className="search-card-header">
            <div className="search-card-title-wrap">
              <h2>
                Search in <span className="text-orange">3 quick steps</span>
              </h2>
              {vehicleType && (
                <span className="selected-type-badge">
                  Type: <strong>{vehicleTypeCards.find(c => c.id === vehicleType)?.title || vehicleType}</strong>
                </span>
              )}
            </div>
            <div className="search-card-header-actions">
              {(filter.location || filter.brand || filter.minPrice || filter.maxPrice || vehicleType || filterFuel !== "any" || pinnedLocation) && (
                <button
                  className="reset-btn"
                  onClick={handleReset}
                  title="Clear all search filters"
                >
                  <Trash2 size={13} /> Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Compact 1-Row Vehicle Type Filter */}
          <div className="vehicle-type-strip-section">
            <div className="vehicle-type-mini-header">
              <span className="mini-header-label">SELECT VEHICLE TYPE</span>
              {vehicleType && (
                <button
                  className="mini-clear-btn"
                  type="button"
                  onClick={() => setVehicleType("")}
                >
                  Clear Selection
                </button>
              )}
            </div>
            <div className="vehicle-type-compact-grid">
              {vehicleTypeCards.map((type) => {
                const isActive = vehicleType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    className={`vehicle-type-pill-card ${isActive ? "active-type-pill" : ""}`}
                    onClick={() => setVehicleType(isActive ? "" : type.id)}
                  >
                    <div className="type-card-img-wrap">
                      <img src={type.image} alt={type.title} />
                    </div>
                    <span className="type-card-label">{type.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3 Step Search Row */}
          <div className="search-steps-row">
            {/* Step 1: Location */}
            <div className="search-step step-location">
              <div className="step-label">
                <span className="step-num active-num">1</span>
                <span>Location</span>
                <button
                  type="button"
                  onClick={handleLocateMe}
                  disabled={isLocating}
                  className="locate-me-btn"
                  title="Use my GPS Location"
                >
                  <LocateFixed size={13} className={isLocating ? "animate-spin" : ""} />
                  {isLocating ? "Locating..." : "Locate Me"}
                </button>
              </div>
              <div className="step-input-box">
                <MapPin size={17} className="icon-orange-txt flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Town, city or click map..."
                  value={filter.location}
                  onChange={(e) => {
                    setFilter({ ...filter, location: e.target.value });
                    if (pinnedLocation) setPinnedLocation(null);
                    if (userLocation) setUserLocation(null);
                  }}
                />
                {pinnedLocation && (
                  <button
                    type="button"
                    onClick={handleClearPinnedLocation}
                    className="clear-pin-chip"
                    title="Clear pinned location"
                  >
                    Clear
                  </button>
                )}
              </div>
              {activeCenter && (
                <div className="radius-compact-strip">
                  <span className="radius-badge-label">🎯 RADIUS:</span>
                  <select 
                    value={radius} 
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="radius-select-input"
                  >
                    <option value={5}>5 km radius</option>
                    <option value={10}>10 km radius</option>
                    <option value={20}>20 km radius</option>
                    <option value={50}>50 km radius</option>
                    <option value={100}>100 km radius</option>
                  </select>
                </div>
              )}
            </div>

            {/* Step 2: Brand */}
            <div className="search-step step-brand">
              <div className="step-label">
                <span className="step-num active-num">2</span>
                <span>Brand / Model</span>
              </div>
              <div className="step-input-box">
                <Car size={17} className="icon-blue-txt flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Toyota, Honda, Benz..."
                  value={filter.brand}
                  onChange={(e) =>
                    setFilter({ ...filter, brand: e.target.value })
                  }
                />
                {filter.brand && (
                  <button
                    type="button"
                    onClick={() => setFilter({ ...filter, brand: "" })}
                    className="clear-inline-btn"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Step 3: Price / day */}
            <div className="search-step step-price">
              <div className="step-label">
                <span className="step-num active-num">3</span>
                <span>Price / day (LKR)</span>
              </div>
              <div className="price-inputs-wrapper">
                <div className="step-input-box price-half">
                  <span className="currency-tag">Min</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={filter.minPrice}
                    onChange={(e) =>
                      setFilter({ ...filter, minPrice: e.target.value })
                    }
                  />
                </div>
                <span className="price-divider">-</span>
                <div className="step-input-box price-half">
                  <span className="currency-tag">Max</span>
                  <input
                    type="number"
                    placeholder="Any"
                    value={filter.maxPrice}
                    onChange={(e) =>
                      setFilter({ ...filter, maxPrice: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Search Action */}
            <div className="search-action">
              <button 
                className="big-search-btn"
                type="button"
                onClick={() => {
                  const el = document.getElementById("vehicle-results-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Bottom Bar */}
          <div className="filter-bottom-row">
            <div className="filter-group">
              <span className="filter-label">SORT:</span>
              <button
                className={`filter-pill mode-pill ${
                  filterShow === "nearest" ? "active-mode" : ""
                }`}
                onClick={() => setFilterShow("nearest")}
              >
                <Navigation
                  size={13}
                  className={filterShow === "nearest" ? "" : "icon-gray-txt"}
                />{" "}
                Nearest
              </button>
              <button
                className={`filter-pill mode-pill ${
                  filterShow === "top-rated" ? "active-mode" : ""
                }`}
                onClick={() => setFilterShow("top-rated")}
              >
                <Star
                  size={13}
                  className={filterShow === "top-rated" ? "" : "icon-gray-txt"}
                />{" "}
                Top rated
              </button>
            </div>

            <div className="filter-group fuel-group">
              <span className="filter-label">FUEL:</span>
              {["any", "petrol", "diesel", "hybrid", "electric"].map((f) => (
                <button
                  key={f}
                  className={`filter-pill fuel-pill ${
                    filterFuel === f ? "active-fuel" : ""
                  }`}
                  onClick={() => setFilterFuel(f)}
                >
                  {f === "any" ? "All Fuel" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="match-count-pill">
              <Sliders size={13} className="icon-orange-txt" />{" "}
              <strong>{filtered.length}</strong> {filtered.length === 1 ? "car found" : "cars found"}
            </div>
          </div>
        </div>
      </div>

      <div className="container" id="vehicle-results-section">
        <div className="results-header-modern">
          <div className="results-titles">
            <h2>Available Vehicles</h2>
            <p>{filtered.length} verified vehicles · live availability</p>
          </div>
          <div className="results-header-actions">
            <div className="view-toggle">
              <button
                className={`view-toggle-btn ${viewMode === "grid" ? "active-view" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid View"
              >
                <LayoutGrid size={18} />
                <span>Grid</span>
              </button>
              <button
                className={`view-toggle-btn ${viewMode === "map" ? "active-view" : ""}`}
                onClick={() => setViewMode("map")}
                title="Map View"
              >
                <Map size={18} />
                <span>Map</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading vehicles...</p>
          </div>
        ) : viewMode === "grid" ? (
          filtered.length === 0 ? (
            <div className="empty-state">
              <span>🔍</span>
              <h3>No vehicles found</h3>
              <p>Try changing your filters or expanding your search radius</p>
              {pinnedLocation && (
                <button
                  type="button"
                  className="sidebar-reset-action-btn"
                  onClick={handleClearPinnedLocation}
                  style={{ marginTop: "1rem" }}
                >
                  View All Available Vehicles
                </button>
              )}
            </div>
          ) : (
            <div className="vehicle-grid">
              {filtered.map((vehicle) => (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                  distance={vehicle.distanceFromCenter}
                />
              ))}
            </div>
          )
        ) : (
          <div className="listing-map-section">
            <div className="listing-map-container">
              {/* Map UI overlays */}
              {pinnedLocation ? (
                <div className="map-pinned-banner">
                  <div className="map-pinned-left">
                    <span className="pinned-pulse-dot" />
                    <div>
                      <span className="pinned-title">Searching near pinned location</span>
                      <p className="pinned-addr">{pinnedLocation.address}</p>
                    </div>
                  </div>
                  <div className="map-pinned-right">
                    <span className="pinned-count-pill">
                      {filtered.length} within {radius}km
                    </span>
                    <button
                      type="button"
                      onClick={handleClearPinnedLocation}
                      className="pinned-clear-btn"
                      title="Clear pinned location"
                    >
                      Clear Pin
                    </button>
                  </div>
                </div>
              ) : (
                <div className="map-hint-banner">
                  <span className="map-hint-icon">📍</span>
                  <span>Click anywhere on the map to find cars within 20km</span>
                </div>
              )}

              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={listingMapContainerStyle}
                  center={mapCenter}
                  zoom={mapZoom}
                  onLoad={(map) => {
                    mapRef.current = map;
                  }}
                  onZoomChanged={() => {
                    if (mapRef.current) {
                      const newZ = mapRef.current.getZoom();
                      if (typeof newZ === "number") {
                        setCurrentZoom(newZ);
                      }
                    }
                  }}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                    styles: [
                      { featureType: "poi", stylers: [{ visibility: "off" }] },
                      {
                        featureType: "transit",
                        stylers: [{ visibility: "off" }],
                      },
                    ],
                  }}
                  onClick={handleMapClick}
                >
                  {/* Pinned Location Marker & 20km Circle */}
                  {pinnedLocation && (
                    <>
                      <MarkerF
                        position={{ lat: Number(pinnedLocation.lat), lng: Number(pinnedLocation.lng) }}
                        title="Selected Location (20km Search Center)"
                        zIndex={1000}
                        icon={
                          window.google?.maps ? {
                            url: BLUE_SEARCH_PIN_SVG,
                            scaledSize: new window.google.maps.Size(46, 58),
                            anchor: new window.google.maps.Point(23, 56),
                          } : undefined
                        }
                      />
                      <CircleF
                        center={{ lat: Number(pinnedLocation.lat), lng: Number(pinnedLocation.lng) }}
                        radius={radius * 1000}
                        options={{
                          fillColor: "#3b82f6",
                          fillOpacity: 0.16,
                          strokeColor: "#2563eb",
                          strokeOpacity: 0.85,
                          strokeWeight: 2.5,
                          clickable: false,
                        }}
                      />
                    </>
                  )}

                  {/* GPS User Location (if active and not custom pinned) */}
                  {!pinnedLocation && userLocation && filter.location === "My GPS Location" && (
                    <>
                      <MarkerF
                        position={{ lat: Number(userLocation.lat), lng: Number(userLocation.lng) }}
                        icon={
                          window.google?.maps ? {
                            url: BLUE_SEARCH_PIN_SVG,
                            scaledSize: new window.google.maps.Size(40, 50),
                            anchor: new window.google.maps.Point(20, 48),
                          } : undefined
                        }
                        title="Your GPS Location"
                      />
                      <CircleF
                        center={{ lat: Number(userLocation.lat), lng: Number(userLocation.lng) }}
                        radius={radius * 1000}
                        options={{
                          fillColor: "#3b82f6",
                          fillOpacity: 0.12,
                          strokeColor: "#3b82f6",
                          strokeOpacity: 0.6,
                          strokeWeight: 2,
                          clickable: false,
                        }}
                      />
                    </>
                  )}

                  {/* Vehicle Cluster Markers */}
                  {vehicleClusters.map((cluster) => {
                    const isMulti = cluster.vehicles.length > 1;
                    const count = cluster.vehicles.length;
                    const isSelected = selectedCluster?.id === cluster.id;

                    return (
                      <MarkerF
                        key={cluster.id}
                        position={{ lat: cluster.lat, lng: cluster.lng }}
                        title={
                          isMulti
                            ? `${count} Vehicles Available Here: ${cluster.vehicles
                                .map((v) => `${v.brand} ${v.model}`)
                                .join(", ")}`
                            : `${cluster.vehicles[0].brand} ${cluster.vehicles[0].model}`
                        }
                        zIndex={isSelected ? 500 : isMulti ? 200 + count : 100}
                        icon={
                          window.google?.maps
                            ? isMulti
                              ? {
                                  url: getMultiVehiclePinSvg(count),
                                  scaledSize: new window.google.maps.Size(46, 56),
                                  anchor: new window.google.maps.Point(23, 54),
                                }
                              : {
                                  url: ORANGE_CAR_PIN_SVG,
                                  scaledSize: new window.google.maps.Size(38, 48),
                                  anchor: new window.google.maps.Point(19, 46),
                                }
                            : undefined
                        }
                        onClick={(e) => handleMarkerClick(cluster, e)}
                      />
                    );
                  })}

                  {/* Selected Cluster InfoWindow */}
                  {selectedCluster &&
                    selectedCluster.lat &&
                    selectedCluster.lng && (() => {
                      const curV =
                        selectedCluster.vehicles[activeClusterIndex] ||
                        selectedCluster.vehicles[0];
                      if (!curV) return null;
                      const hasMultiple = selectedCluster.vehicles.length > 1;

                      return (
                        <InfoWindowF
                          position={{
                            lat: selectedCluster.lat,
                            lng: selectedCluster.lng,
                          }}
                          onCloseClick={() => {
                            setSelectedCluster(null);
                            setSelectedVehicle(null);
                          }}
                        >
                          <div className="map-info-card">
                            {/* Multi-vehicle navigation bar */}
                            {hasMultiple && (
                              <div className="map-cluster-nav-header">
                                <div className="map-cluster-pill">
                                  <Layers size={13} />
                                  <span>
                                    <strong>{selectedCluster.vehicles.length} Vehicles</strong> at this spot
                                  </span>
                                </div>
                                <div className="map-cluster-arrows">
                                  <button
                                    type="button"
                                    className="map-cluster-arrow-btn"
                                    title="Previous vehicle"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const nextIdx =
                                        (activeClusterIndex -
                                          1 +
                                          selectedCluster.vehicles.length) %
                                        selectedCluster.vehicles.length;
                                      setActiveClusterIndex(nextIdx);
                                      setSelectedVehicle(
                                        selectedCluster.vehicles[nextIdx]
                                      );
                                    }}
                                  >
                                    <ChevronLeft size={13} />
                                  </button>
                                  <span className="map-cluster-counter">
                                    {activeClusterIndex + 1}/
                                    {selectedCluster.vehicles.length}
                                  </span>
                                  <button
                                    type="button"
                                    className="map-cluster-arrow-btn"
                                    title="Next vehicle"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const nextIdx =
                                        (activeClusterIndex + 1) %
                                        selectedCluster.vehicles.length;
                                      setActiveClusterIndex(nextIdx);
                                      setSelectedVehicle(
                                        selectedCluster.vehicles[nextIdx]
                                      );
                                    }}
                                  >
                                    <ChevronRight size={13} />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Quick vehicle switcher tabs */}
                            {hasMultiple && (
                              <div className="map-cluster-tabs">
                                {selectedCluster.vehicles.map((veh, idx) => (
                                  <button
                                    key={veh._id}
                                    type="button"
                                    className={`map-cluster-tab-btn ${
                                      idx === activeClusterIndex ? "active" : ""
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveClusterIndex(idx);
                                      setSelectedVehicle(veh);
                                    }}
                                  >
                                    {veh.brand} {veh.model}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Active vehicle preview */}
                            {curV.images && curV.images[0] && (
                              <div className="map-info-img-wrap">
                                <img
                                  src={formatVehicleImageUrl(curV.images, curV.vehicleType)}
                                  alt={`${curV.brand} ${curV.model}`}
                                  className="map-info-img"
                                  onError={(e) => handleImageError(e, formatVehicleImageUrl(null, curV.vehicleType))}
                                />
                                {hasMultiple && (
                                  <span className="map-info-img-badge">
                                    {activeClusterIndex + 1} of {selectedCluster.vehicles.length}
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="map-info-body">
                              <h4>
                                {curV.brand} {curV.model}
                              </h4>
                              {curV.distanceFromCenter !== null &&
                                curV.distanceFromCenter !== undefined && (
                                  <div className="map-info-dist-badge">
                                    📍 {curV.distanceFromCenter.toFixed(1)} km from pin
                                  </div>
                                )}
                              <p className="map-info-location">
                                <MapPin size={12} /> {curV.location}
                              </p>
                              <div className="map-info-footer">
                                <span className="map-info-price">
                                  LKR {curV.pricePerDay?.toLocaleString()}/day
                                  <small
                                    style={{
                                      display: "block",
                                      fontSize: "0.68rem",
                                      fontWeight: 700,
                                      color: "#ea580c",
                                    }}
                                  >
                                    +LKR {curV.pricePerKmAfter100km || 0}/km after 100km
                                  </small>
                                </span>
                                <Link
                                  to={`/vehicle/${curV._id}`}
                                  className="map-info-book"
                                >
                                  Book →
                                </Link>
                              </div>
                            </div>
                          </div>
                        </InfoWindowF>
                      );
                    })()}
                </GoogleMap>
              ) : (
                <div className="listing-map-loading">
                  <div className="spinner" />
                  <span>Loading Map...</span>
                </div>
              )}
            </div>

            {/* Sidebar List */}
            <div className="listing-map-sidebar">
              <div className="map-sidebar-header">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3>
                    {activeCenter
                      ? `${filtered.length} vehicles within ${radius}km`
                      : `${filtered.filter((v) => v.lat && v.lng).length} vehicles on map`}
                  </h3>
                  {pinnedLocation && (
                    <button
                      type="button"
                      onClick={handleClearPinnedLocation}
                      className="sidebar-clear-pin-btn"
                    >
                      Clear Pin
                    </button>
                  )}
                </div>
                <p>
                  {activeCenter
                    ? "Vehicles sorted by proximity to your selected point"
                    : "Click anywhere on the map to find cars within 20km"}
                </p>
              </div>

              <div className="map-sidebar-list">
                {filtered.length === 0 ? (
                  <div className="map-sidebar-empty">
                    <span className="empty-icon">🔍</span>
                    <strong>No vehicles found in this 20km radius</strong>
                    <p>Try clicking another town or district on the map, or clear the pin.</p>
                    {pinnedLocation && (
                      <button
                        type="button"
                        className="sidebar-reset-action-btn"
                        onClick={handleClearPinnedLocation}
                      >
                        View All Available Vehicles
                      </button>
                    )}
                  </div>
                ) : (
                  filtered.map((v) => {
                    const isSelected = selectedVehicle?._id === v._id;
                    const isInSelectedCluster =
                      selectedCluster &&
                      selectedCluster.vehicles.length > 1 &&
                      selectedCluster.vehicles.some((cv) => cv._id === v._id);

                    return (
                      <button
                        key={v._id}
                        className={`map-sidebar-item ${
                          isSelected ? "map-sidebar-active" : ""
                        } ${
                          isInSelectedCluster && !isSelected
                            ? "map-sidebar-in-cluster"
                            : ""
                        }`}
                        onClick={() => handleSidebarVehicleClick(v)}
                      >
                        <div className="map-sidebar-img-wrap">
                          {v.images && v.images.length > 0 ? (
                            <img
                              src={formatVehicleImageUrl(v.images, v.vehicleType)}
                              alt={v.brand}
                              onError={(e) => handleImageError(e, formatVehicleImageUrl(null, v.vehicleType))}
                            />
                          ) : (
                            <div className="map-sidebar-placeholder">
                              <Car size={20} />
                            </div>
                          )}
                        </div>
                        <div className="map-sidebar-info">
                          <div className="sidebar-info-top">
                            <strong>
                              {v.brand} {v.model}
                            </strong>
                            {v.distanceFromCenter !== null &&
                              v.distanceFromCenter !== undefined && (
                                <span className="sidebar-dist-pill">
                                  {v.distanceFromCenter.toFixed(1)} km
                                </span>
                              )}
                          </div>
                          <span className="map-sidebar-loc">
                            <MapPin size={11} /> {v.location}
                          </span>
                          <span className="map-sidebar-price">
                            LKR {v.pricePerDay?.toLocaleString()}/day
                            <small
                              style={{
                                display: "block",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                color: "#ea580c",
                              }}
                            >
                              +LKR {v.pricePerKmAfter100km || 0}/km after 100km
                            </small>
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* Listing Page Core */
        .listing-page {
          min-height: calc(100vh - 68px);
          padding-bottom: 80px;
          background: #fcfbf9;
        }

        /* Modern Ultra-Sleek Header */
        .modern-header-section {
          background: radial-gradient(circle at 50% 20%, #fff7ed 0%, #ffedd5 55%, #fef3e7 100%);
          padding: 85px 1.5rem 1.75rem;
          text-align: center;
          border-bottom: 1px solid rgba(254, 215, 170, 0.45);
          position: relative;
        }

        .top-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(249, 115, 22, 0.22);
          padding: 0.3rem 0.85rem;
          border-radius: 9999px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #c2410c;
          margin-bottom: 0.75rem;
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.08);
        }

        .modern-title {
          font-size: clamp(1.85rem, 3.4vw, 2.75rem);
          font-weight: 900;
          color: #111827;
          line-height: 1.15;
          letter-spacing: -0.025em;
          margin: 0 0 0.4rem 0;
        }

        .text-orange {
          color: #f97316;
        }

        .modern-subtitle {
          font-size: 0.95rem;
          color: #6b7280;
          max-width: 580px;
          line-height: 1.45;
          margin: 0 auto;
        }

        /* 3-Step Search Card */
        .search-card-block {
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid rgba(249, 115, 22, 0.16);
          border-radius: 1.5rem;
          padding: 1.35rem 1.6rem 1.25rem;
          box-shadow: 0 20px 45px -10px rgba(249, 115, 22, 0.08), 0 2px 8px rgba(0, 0, 0, 0.03);
          margin-top: 1.25rem;
          margin-bottom: 2rem;
          position: relative;
          backdrop-filter: blur(16px);
        }

        .search-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.85rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .search-card-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .search-card-header h2 {
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0;
          color: #111827;
          letter-spacing: -0.01em;
        }

        .selected-type-badge {
          background: #ffedd5;
          color: #c2410c;
          border: 1px solid #fed7aa;
          font-size: 0.74rem;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .reset-btn {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.35rem 0.8rem;
          border-radius: 100px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all 0.2s ease;
        }
        .reset-btn:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
          transform: translateY(-1px);
        }

        /* Compact 1-Row Vehicle Type Filter */
        .vehicle-type-strip-section {
          background: #faf8f5;
          border: 1px solid #f0ebe4;
          border-radius: 1.15rem;
          padding: 0.75rem 0.9rem;
          margin-bottom: 1rem;
        }

        .vehicle-type-mini-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.55rem;
        }

        .mini-header-label {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #9ca3af;
        }

        .mini-clear-btn {
          background: none;
          border: none;
          color: #ea580c;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
        }
        .mini-clear-btn:hover {
          text-decoration: underline;
        }

        .vehicle-type-compact-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 0.65rem;
        }

        .vehicle-type-pill-card {
          background: #ffffff;
          border: 1.5px solid #e9ecef;
          border-radius: 12px;
          padding: 0.5rem 0.35rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          height: 72px;
          text-align: center;
        }

        .vehicle-type-pill-card:hover {
          border-color: #fdba74;
          background: #fffbf7;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.12);
        }

        .vehicle-type-pill-card.active-type-pill {
          border-color: #f97316;
          background: linear-gradient(145deg, #fff7ed 0%, #fed7aa 100%);
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.25);
          transform: translateY(-2px);
        }

        .type-card-img-wrap {
          height: 34px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .type-card-img-wrap img {
          max-height: 100%;
          max-width: 90%;
          object-fit: contain;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.06));
        }

        .type-card-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .vehicle-type-pill-card.active-type-pill .type-card-label {
          color: #9a3412;
          font-weight: 800;
        }

        /* 3-Step Search Row */
        .search-steps-row {
          display: flex;
          gap: 0.85rem;
          align-items: flex-end;
          margin-bottom: 0.85rem;
        }

        .search-step {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .step-location { flex: 1.25; }
        .step-brand { flex: 1; }
        .step-price { flex: 1.35; }

        .step-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .step-num {
          width: 17px;
          height: 17px;
          border-radius: 50%;
          background: #f97316;
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.68rem;
          font-weight: 800;
        }

        .locate-me-btn {
          margin-left: auto;
          background: none;
          border: none;
          color: #ea580c;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 0;
          transition: color 0.15s ease;
        }
        .locate-me-btn:hover { color: #c2410c; }

        .step-input-box {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: #ffffff;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 0.55rem 0.85rem;
          height: 44px;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        .step-input-box:focus-within {
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.12);
        }

        .step-input-box input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          font-size: 0.88rem;
          font-weight: 600;
          color: #111827;
          font-family: inherit;
        }

        .step-input-box input::placeholder {
          color: #9ca3af;
          font-weight: 500;
        }

        .clear-pin-chip {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 6px;
          padding: 2px 7px;
          font-size: 0.7rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .clear-inline-btn {
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 1.1rem;
          line-height: 1;
          cursor: pointer;
          padding: 0 2px;
        }
        .clear-inline-btn:hover { color: #4b5563; }

        .radius-compact-strip {
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
          background: #eff6ff;
          padding: 3px 8px;
          border-radius: 6px;
          border: 1px solid #bfdbfe;
        }

        .radius-badge-label {
          font-size: 0.66rem;
          color: #1e40af;
          font-weight: 800;
        }

        .radius-select-input {
          font-size: 0.74rem;
          padding: 2px 4px;
          border-radius: 4px;
          border: 1px solid #93c5fd;
          flex: 1;
          color: #1e3a8a;
          font-weight: 700;
          background: white;
          outline: none;
        }

        .price-inputs-wrapper {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          width: 100%;
        }

        .price-half {
          flex: 1;
          padding: 0.55rem 0.65rem;
        }

        .price-divider {
          color: #9ca3af;
          font-weight: 700;
          font-size: 0.85rem;
        }

        .currency-tag {
          font-size: 0.68rem;
          font-weight: 800;
          color: #9ca3af;
          text-transform: uppercase;
        }

        /* Search Button */
        .search-action {
          flex-shrink: 0;
        }

        .big-search-btn {
          background: linear-gradient(135deg, #ff8800 0%, #f97316 45%, #ea580c 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0 1.65rem;
          height: 44px;
          font-weight: 750;
          font-size: 0.92rem;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 6px 20px -2px rgba(249, 115, 22, 0.45);
          font-family: inherit;
        }

        .big-search-btn:hover {
          background: linear-gradient(135deg, #ff9500 0%, #ea580c 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 24px -2px rgba(234, 88, 12, 0.55);
        }

        /* Bottom Quick Filter Bar */
        .filter-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.75rem;
          border-top: 1px solid #f3f4f6;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .filter-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: #9ca3af;
          letter-spacing: 0.05em;
          margin-right: 0.15rem;
        }

        .filter-pill {
          border: 1px solid #e5e7eb;
          background: white;
          padding: 0.28rem 0.7rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #4b5563;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          transition: all 0.18s ease;
          font-family: inherit;
        }

        .filter-pill:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .filter-pill.active-mode,
        .filter-pill.active-fuel {
          background: linear-gradient(135deg, #ff8800 0%, #ea580c 100%);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.35);
        }

        .match-count-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: #4b5563;
          background: #f3f4f6;
          padding: 0.28rem 0.75rem;
          border-radius: 100px;
        }

        .match-count-pill strong {
          color: #111827;
        }

        .icon-orange-txt { color: #f97316; }
        .icon-blue-txt { color: #3b82f6; }
        .icon-gray-txt { color: #9ca3af; }

        /* Results & Grid */
        .results-header-modern {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .results-titles h2 {
          font-size: 1.45rem;
          font-weight: 800;
          margin: 0;
          color: #111827;
        }

        .results-titles p {
          margin: 0.2rem 0 0;
          color: #6b7280;
          font-size: 0.85rem;
        }

        .results-header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .view-toggle {
          display: flex;
          background: #f3f4f6;
          border-radius: 100px;
          padding: 3px;
          gap: 2px;
        }

        .view-toggle-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0.4rem 0.95rem;
          border-radius: 100px;
          border: none;
          background: transparent;
          font-size: 0.8rem;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .view-toggle-btn:hover { color: #111827; }
        .view-toggle-btn.active-view {
          background: #f97316;
          color: white;
          box-shadow: 0 2px 8px rgba(249,115,22,0.25);
        }

        .vehicle-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 1.25rem;
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 3.5rem 1rem;
          color: #6b7280;
        }

        /* Map Section Styles */
        .listing-map-section {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 1.5rem;
          height: 670px;
          animation: fadeInUp 0.4s ease both;
        }

        .listing-map-container {
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.06);
          position: relative;
        }

        .listing-map-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 1rem;
          color: #6b7280;
        }

        .map-pinned-banner {
          position: absolute;
          top: 14px;
          left: 14px;
          right: 14px;
          z-index: 10;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(37, 99, 235, 0.25);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15);
          border-radius: 14px;
          padding: 10px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .map-pinned-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .pinned-pulse-dot {
          width: 10px;
          height: 10px;
          background: #2563eb;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
          animation: pulse 1.8s infinite;
          flex-shrink: 0;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.5); }
          70% { box-shadow: 0 0 0 8px rgba(37, 99, 235, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
        }

        .pinned-title {
          font-size: 0.82rem;
          font-weight: 800;
          color: #1e40af;
          display: block;
        }

        .pinned-addr {
          margin: 0;
          font-size: 0.76rem;
          color: #4b5563;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 320px;
        }

        .map-pinned-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .pinned-count-pill {
          background: #dbeafe;
          color: #1e40af;
          font-weight: 700;
          font-size: 0.74rem;
          padding: 4px 10px;
          border-radius: 20px;
        }

        .pinned-clear-btn {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          font-weight: 700;
          font-size: 0.76rem;
          padding: 5px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.2s;
        }
        .pinned-clear-btn:hover { background: #fecaca; }

        .map-hint-banner {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 10;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          border-radius: 100px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: #374151;
          pointer-events: none;
        }

        .map-hint-icon { font-size: 1rem; }

        .map-info-card {
          width: 250px;
          font-family: var(--font-body);
        }

        .map-cluster-nav-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 5px 8px;
          margin-bottom: 8px;
          gap: 6px;
        }

        .map-cluster-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          color: #1e293b;
        }

        .map-cluster-pill strong {
          color: #ea580c;
        }

        .map-cluster-arrows {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .map-cluster-arrow-btn {
          width: 22px;
          height: 22px;
          border-radius: 4px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #334155;
          padding: 0;
          transition: all 0.15s ease;
        }

        .map-cluster-arrow-btn:hover {
          background: #ea580c;
          border-color: #ea580c;
          color: #ffffff;
        }

        .map-cluster-counter {
          font-size: 0.72rem;
          font-weight: 800;
          color: #475569;
          min-width: 26px;
          text-align: center;
        }

        .map-cluster-tabs {
          display: flex;
          gap: 4px;
          overflow-x: auto;
          padding-bottom: 4px;
          margin-bottom: 8px;
          scrollbar-width: thin;
        }

        .map-cluster-tab-btn {
          font-size: 0.68rem;
          font-weight: 600;
          padding: 3px 7px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          background: #f1f5f9;
          color: #475569;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .map-cluster-tab-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .map-cluster-tab-btn.active {
          background: #ea580c;
          border-color: #ea580c;
          color: #ffffff;
          font-weight: 700;
        }

        .map-info-img-wrap {
          position: relative;
          width: 100%;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .map-info-img-wrap .map-info-img {
          margin-bottom: 0;
          display: block;
        }

        .map-info-img-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(4px);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .map-info-img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 8px;
        }

        .map-info-body h4 {
          margin: 0 0 4px;
          font-size: 0.95rem;
          font-weight: 800;
          color: #111827;
        }

        .map-info-dist-badge {
          display: inline-block;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 6px;
          margin-bottom: 6px;
          border: 1px solid #bfdbfe;
        }

        .map-info-location {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #6b7280;
          font-size: 0.78rem;
          margin: 0 0 8px;
        }

        .map-info-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .map-info-price {
          font-weight: 800;
          font-size: 0.88rem;
          color: #f97316;
        }

        .map-info-book {
          background: #f97316;
          color: white;
          padding: 5px 14px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.78rem;
          text-decoration: none;
          transition: 0.2s;
          box-shadow: 0 3px 8px rgba(249,115,22,0.3);
        }
        .map-info-book:hover { background: #ea580c; }

        /* Map Sidebar */
        .listing-map-sidebar {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 1.5rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
        }

        .map-sidebar-header {
          padding: 1.15rem 1.4rem;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .map-sidebar-header h3 {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 800;
          color: #111827;
        }

        .sidebar-clear-pin-btn {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 6px;
          padding: 3px 8px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }
        .sidebar-clear-pin-btn:hover { background: #fecaca; }

        .map-sidebar-header p {
          margin: 4px 0 0;
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .map-sidebar-list {
          overflow-y: auto;
          flex: 1;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .map-sidebar-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2.5rem 1rem;
          color: #6b7280;
        }

        .map-sidebar-empty .empty-icon {
          font-size: 2.2rem;
          margin-bottom: 0.75rem;
        }

        .map-sidebar-empty strong {
          color: #1f2937;
          font-size: 0.92rem;
          margin-bottom: 0.35rem;
        }

        .map-sidebar-empty p {
          font-size: 0.78rem;
          color: #9ca3af;
          margin-bottom: 1rem;
        }

        .sidebar-reset-action-btn {
          background: #f97316;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(249,115,22,0.25);
        }
        .sidebar-reset-action-btn:hover { background: #ea580c; }

        .map-sidebar-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem;
          border-radius: 1rem;
          border: 1.5px solid transparent;
          background: #fafafa;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          font-family: inherit;
        }

        .map-sidebar-item:hover {
          border-color: rgba(249,115,22,0.15);
          background: #fff7ed;
        }

        .map-sidebar-item.map-sidebar-active {
          border-color: #f97316;
          background: #fff7ed;
          box-shadow: 0 4px 12px rgba(249,115,22,0.1);
        }

        .map-sidebar-item.map-sidebar-in-cluster {
          border-left: 3px solid #fdba74;
          background: rgba(255, 247, 237, 0.6);
        }

        .map-sidebar-img-wrap {
          width: 56px;
          height: 56px;
          border-radius: 0.75rem;
          overflow: hidden;
          flex-shrink: 0;
        }

        .map-sidebar-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .map-sidebar-placeholder {
          width: 100%;
          height: 100%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
        }

        .map-sidebar-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
          flex: 1;
        }

        .sidebar-info-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 6px;
        }

        .sidebar-info-top strong {
          font-size: 0.9rem;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-dist-pill {
          background: #dbeafe;
          color: #1e40af;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .map-sidebar-loc {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .map-sidebar-price {
          font-size: 0.82rem;
          font-weight: 800;
          color: #f97316;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .vehicle-type-compact-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 900px) {
          .modern-header-section {
            padding: 75px 1rem 1.25rem;
          }
          .search-steps-row {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          .big-search-btn {
            width: 100%;
            justify-content: center;
          }
          .listing-map-section {
            grid-template-columns: 1fr;
            height: auto;
          }
          .listing-map-container {
            height: 400px;
          }
          .listing-map-sidebar {
            max-height: 300px;
          }
        }

        @media (max-width: 640px) {
          .vehicle-type-compact-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 0.4rem;
          }
          .vehicle-type-pill-card {
            height: 64px;
            padding: 0.35rem 0.2rem;
          }
          .type-card-img-wrap {
            height: 28px;
          }
          .type-card-label {
            font-size: 0.65rem;
          }
          .fuel-group {
            overflow-x: auto;
            max-width: 100%;
            padding-bottom: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default VehicleListing;