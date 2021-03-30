
    var btn = document.getElementById("btn");
    var btn2 = document.getElementById("btn2");
    var btn3 = document.getElementById("btn3");
    var audio = document.getElementById("player");
var choose = document.getElementById("choose");


    btn.addEventListener("click", function () {
        audio.play();
            choose.play();
            loadModel(model, 9, 9, 9);
        });

        btn2.addEventListener("click", function () {
        audio.play();
            choose.play();
            loadModel(model2);
        });

        btn3.addEventListener("click", function () {
        audio.play();
            choose.play();
            loadModel(model3, 9, 9, 9);
        });

        import * as THREE from "/Content/ThreeJS/build/three.module.js";
        import { OrbitControls } from "/Content/ThreeJS/build/OrbitControls.js";
        import { GLTFLoader } from "/Content/ThreeJS/build/GLTFLoader.js";
        import { RGBELoader } from "/Content/ThreeJS/build/RGBELoader.js";

        var camera, scene, renderer;
        var car;
        var gltf_loader = new GLTFLoader();

var model = "/Content/ThreeJS/gltf/pagani_zonda_shooting_car/scene.gltf";
var model2 = "/Content/ThreeJS/gltf/lamborghini_urus/scene.gltf";
var model3 = "/Content/ThreeJS/gltf/alfa_romeo_stradale_1967/scene.gltf";

        init();
        loop();

        function init() {
            const container = document.createElement("div");
            document.body.appendChild(container);
            // ------------------------------------ *** ---------------------------------------

            camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );
            camera.position.set(40, 20, 40);

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xcccccc);

            renderer = new THREE.WebGLRenderer({antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.outputEncoding = THREE.sRGBEncoding;

            container.appendChild(renderer.domElement);

            // LOAD MODEL
            gltf_loader.load(model, function (gltf) {
        car = gltf.scene;
                gltf.scene.scale.set(0.1, 0.1, 0.1);
                // scene.add(gltf.scene);

                render();
            });

            var light = new THREE.PointLight(0xffffff, 2);
            light.position.set(100, 100, 100);
            scene.add(light);

            // LOAD TEXTURE
            const rgbe_loader = new RGBELoader();

            rgbe_loader.setDataType(THREE.UnsignedByteType);
            rgbe_loader.load("/Content/ThreeJS/hdr/10-Shiodome_Stairs_3k.hdr", function (texture) {
                const pmremGenerator = new THREE.PMREMGenerator(renderer);
                const envMap = pmremGenerator.fromEquirectangular(texture).texture;

                scene.background = envMap;
                scene.environment = envMap;

                render();
            });

            // VIEW CONTROLS
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.addEventListener("change", render);
            controls.minDistance = 10;
            controls.maxDistance = 50;
            controls.target.set(0, 0.5, 0);
            controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
                MIDDLE: THREE.MOUSE.DOLLY,
                RIGHT: THREE.MOUSE.ROTATE,
            };
            // controls.minPolarAngle = 0;
            // controls.maxPolarAngle = Math.PI / 2;
            controls.update();

            window.addEventListener("resize", onWindowResize, false);
        }

        function loadModel(modelPath, x = 0.1, y = 0.1, z = 0.1) {
        gltf_loader.load(modelPath, function (gltf) {
            scene.remove(car);
            car = gltf.scene;
            gltf.scene.scale.set(x, y, z);
            scene.add(car);
            render();
        });
        }

        function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            render();
        }

        function render() {
        renderer.render(scene, camera);
        }

        function loop() {
        requestAnimationFrame(loop);
            car.rotation.y += -0.001;
            renderer.render(scene, camera);
        }